import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ActionRecordService } from 'src/module/action-record/actionRecord.service'
import { MemberClass } from './member-class.schame'
import { CreateMemberClassDto, ListMemberClassRequestDto, UpdateMemberClassDto } from './member-class.dto'

@Injectable()
export class MemberClassService {
    constructor(
        @InjectModel(MemberClass.name) private memberClassModel: Model<MemberClass>,
        private actionRecordService: ActionRecordService
    ) {}

    async findAll(): Promise<MemberClass[]> {
        return this.memberClassModel.find({
            status: 1
        }).exec()
    }

    async getOneById(_id: string) {
        const data = await this.memberClassModel.findOne({ _id, status: 1 }).exec()

        if (data) {
            return data
        } else {
            return {
                msg: 'This member class has been invalidated! Please contact admin!'
            }
        }
    }

    async create(createData: UpdateMemberClassDto) {
        const { _id, className, classCode, ..._data } = createData

        const checkData = await this.memberClassModel.findOne({ className, classCode, status: 1 }).exec()

        if (checkData?._id) {
            await this.actionRecordService.saveRecord({
                actionName: 'Create Member Class',
                actionMethod: 'POST',
                actionFrom: 'Member Class',
                actionData: createData,
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This member class already exist!'
            }
        } else {
            const finalData = {
                ..._data,
                classCode,
                className,
                status: 1,
                createdAt: new Date()
            }

            await this.actionRecordService.saveRecord({
                actionName: 'Create Member Class',
                actionMethod: 'POST',
                actionFrom: 'Member Class',
                actionData: finalData,
                actionSuccess: 'Success',
                createdAt: new Date()
            })

            const create = new this.memberClassModel(finalData)
            return await create.save()
        }
    }

    async update(updateData: UpdateMemberClassDto) {
        const { _id, ..._data } = updateData

        const checkData = await this.memberClassModel.findOne({ _id }).exec()

        if (checkData?.status === 0) {
            await this.actionRecordService.saveRecord({
                actionName: 'Update Member Class',
                actionMethod: 'POST',
                actionFrom: 'Member Class',
                actionData: updateData,
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This member class has been invalidated! Please contact admin!'
            }
        } else {
            const finalData = {
                ..._data,
                updatedAt: new Date()
            }

            await this.actionRecordService.saveRecord({
                actionName: 'Update Member Class',
                actionMethod: 'POST',
                actionFrom: 'Member Class',
                actionData: finalData,
                actionSuccess: 'Sussess',
                createdAt: new Date()
            })

            return await this.memberClassModel.updateOne({ _id }, finalData).exec()
        }
    }

    async invalidate(_id: string) {
        const checkData = await this.memberClassModel.findOne({ _id }).exec()

        if (checkData?.status === 0) {

            await this.actionRecordService.saveRecord({
                actionName: 'Void Member Class',
                actionMethod: 'GET',
                actionFrom: 'Member Class',
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
            const res = await this.memberClassModel.updateOne({ _id}, {
                status: 0,
                updateAt: new Date()
            }).exec()
        
            if (res.modifiedCount === 1) {
                await this.actionRecordService.saveRecord({
                    actionName: 'Void Member Class',
                    actionMethod: 'GET',
                    actionFrom: 'Member Class',
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

    async listPage(request: ListMemberClassRequestDto) {
        const { page, limit, name } = request

        const skip = (page - 1) * limit

        const filters = {
            ...name ? {
                $or: [
                    { classCode: { $regex: name, $options: 'i' }},
                    { className: { $regex: name, $options: 'i' }}
                ]
            } : {},
            status: 1
        }

        const lists = await this.memberClassModel.find(filters).skip(skip)
                .limit(limit)
                .exec()
        const total = await this.memberClassModel.countDocuments().exec()
    
        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            lists,
        }
    }

    async importData(data: CreateMemberClassDto[]) {
        for (const item of data) {
            const { classCode, className, ..._data } = item
    
            const checkData = await this.memberClassModel.findOne({ classCode, className, status: 1 }).exec()
    
            if (checkData) {
                await this.update({ classCode, className, ..._data, _id: checkData._id.toString() })
            } else {
                await this.create({ classCode, className, ..._data })
            }
        }
    }
}