import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Member } from './member-list.schame'
import { Model, Types } from 'mongoose'
import { ActionRecordService } from 'src/module/action-record/actionRecord.service'
import { MemberSpecialDay } from './member-special-day.schame'
import { ListMemberRequestDto, UpdateMemberDto } from './member-list.dto'

@Injectable()
export class MemberService {
    constructor(
        @InjectModel(Member.name) private memberModel: Model<Member>,
        @InjectModel(MemberSpecialDay.name) private memberSpecialDayModel: Model<MemberSpecialDay>,
        private actionRecordService: ActionRecordService
    ) {}

    async getOneById(_id: string) {
        try {
            const data = await this.memberModel.findOne({ 
                _id, 
                status: 1 
            }).exec()
            
            if (!data) {
                return {
                    msg: 'This member has been invalidated! Please contact admin!'
                }
            }
    
            const specialDays = await this.memberSpecialDayModel.find({ 
                memberId: new Types.ObjectId(_id)
            }).exec()
    
            return {
                ...data.toObject(),
                memberSpecialDays: specialDays || [] // Fallback to empty array if null
            }
        } catch (error) {
            console.error('Error in getOneById:', error)
            throw error // Or handle the error as needed
        }
    }

    async create(createData: UpdateMemberDto) {
        const { _id, name, phone, memberSpecialDays, ..._data } = createData

        const checkData = await this.memberModel.findOne({ name, phone, status: 1 }).exec()
    
        if (checkData?._id) {
            await this.actionRecordService.saveRecord({
                actionName: 'Create Member',
                actionMethod: 'POST',
                actionFrom: 'Member',
                actionData: createData,
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This member already exist!'
            }
        } else {
            const memberCode = await this.createNewCode()

            const finalData = {
                ..._data,
                memberCode,
                name,
                phone,
                status: 1,
                createdAt: new Date()
            }

            const create = new this.memberModel(finalData)
            const res = await create.save()
            
            if (res) {
                await this.actionRecordService.saveRecord({
                    actionName: 'Create Member',
                    actionMethod: 'POST',
                    actionFrom: 'Member',
                    actionData: finalData,
                    actionSuccess: 'Success',
                    createdAt: new Date()
                })

                if (memberSpecialDays.length > 0) {

                    for (const data of memberSpecialDays) {
                        const finalData = {
                            ...data,
                            memberId: res._id,
                            status: 1,
                            createdAt: new Date()
                        }
                        const create = new this.memberSpecialDayModel(finalData)
                        await create.save()
                    }
                }

                return {
                    msg: 'Finish add member information!'
                }
            }
        }
    }

    async update(updateData: UpdateMemberDto) {
        const { _id: mainId, memberSpecialDays, ..._MainData } = updateData

        const checkData = await this.memberModel.findOne({ _id: mainId }).exec()

        if (checkData?.status === 0) {
            await this.actionRecordService.saveRecord({
                actionName: 'Update Member',
                actionMethod: 'POST',
                actionFrom: 'Member',
                actionData: updateData,
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This member has been invalidated! Please contact admin!'
            }
        } else {

            const finalData = {
                ..._MainData,
                updatedAt: new Date()
            }

            const res = await this.memberModel.updateOne({ _id: mainId }, finalData)

            if (res) {
                await this.actionRecordService.saveRecord({
                    actionName: 'Update Member',
                    actionMethod: 'POST',
                    actionFrom: 'Member',
                    actionData: finalData,
                    actionSuccess: 'Sussess',
                    createdAt: new Date()
                })

                if (memberSpecialDays.length > 0) {
                    for (const daysData of memberSpecialDays) {
                        const { _id: dataId, ..._data  } = daysData

                        

                        if (dataId) {
                            const finalDaysata = {
                                ..._data,
                                updatedAt: new Date()
                            }
                            await this.memberSpecialDayModel.updateOne({ _id: dataId }, finalDaysata)
                        } else {
                            const finalData = {
                                ..._data,
                                memberId: mainId,
                                status: 1,
                                createdAt: new Date()
                            }
                            const create = new this.memberSpecialDayModel(finalData)
                            await create.save()
                        }
                    }
                }

                return {
                    msg: 'Finish updatedc member information!'
                }

            } else {
                return {
                    msg: 'Ooops! Something went wrong! Please try again!'
                }
            }

        }
    }

    async invalidate(_id: string) {
        const checkData = await this.memberModel.findOne({ _id }).exec()

        if (checkData?.status === 0) {

            await this.actionRecordService.saveRecord({
                actionName: 'Void Member',
                actionMethod: 'GET',
                actionFrom: 'Member',
                actionData: {
                    _id
                },
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This Member Class has been invalidated! Please contact admin!'
            }
        } else {
            const res = await this.memberModel.updateOne({ _id}, {
                status: 0,
                updateAt: new Date()
            }).exec()
        
            if (res.modifiedCount === 1) {
                await this.actionRecordService.saveRecord({
                    actionName: 'Void Member',
                    actionMethod: 'GET',
                    actionFrom: 'Member',
                    actionData: {
                        _id,
                        status: 0,
                        updateAt: new Date()
                    },
                    actionSuccess: 'Success',
                    createdAt: new Date()
                })


                return {
                  msg: 'Invalidate successfully!'
                }
            } else {
                return {
                  msg: 'Ooops! Something went wrong! Please try again!'
                }
            }
        }
    }

    async listPage(req: ListMemberRequestDto) {
        const { page, limit, name, classIds, contact } = req

        const skip = (page - 1) * limit

        const filters = {
            status: 1,
            ...name ? { name: { $regex: name, $options: 'i' } } : {},
            ...contact ? {
                $or: [
                    { phone: { $regex: contact, $options: 'i' } },
                    { email: { $regex: contact, $options: 'i' } },
                    { fax: { $regex: contact, $options: 'i' } },
                ]
            } : {},
            ...classIds && classIds.length > 0 ? { classId: { $in: classIds } } : {}
        }

        const lists = await this.memberModel.find(filters).skip(skip)
                .limit(limit)
                .exec()
        const total = await this.memberModel.find(filters).countDocuments().exec()
    
        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            lists,
        }
    }

    // create new code

    formatNumber(num: number, digits: number): string {
        return (num + 1).toString().padStart(digits, '0')
    }

    async createNewCode() {
        const result = await this.memberModel.aggregate([
            {
              $addFields: { memberCodeInt: { $toInt: "$memberCode" } } // Convert to integer
            },
            {
              $group: { 
                _id: null, 
                maxNumber: { $max: "$memberCodeInt" } // Find max
              }
            }
        ]).exec()

        const maxNumber = result.length > 0 ? result[0].maxNumber : 0
        if (maxNumber == null) {
            return this.formatNumber(0, 6)
        } else {
            return this.formatNumber(maxNumber, 6)
        }
    }

    async removeSpecialDay(_id: string) {
        const checkData = await this.memberSpecialDayModel.findOne({ _id}).exec()

        if (checkData?.status === 0) {
            return {
                msg: 'This member special day has been invalidated! Please contact admin!'
            }
        } else {
            const res = await this.memberSpecialDayModel.updateOne({ _id }, { status: 0 }).exec()

            if (res.modifiedCount === 1) {
                return {
                    msg: 'Invalidate successfully!'
                }
            } else {
                return {
                    msg: 'Ooops! Something went wrong! Please try again!'
                }
            }
        }
        
    }

}