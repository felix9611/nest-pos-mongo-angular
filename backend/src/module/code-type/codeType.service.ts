import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CodeType } from './codeType.schame'
import { Model } from 'mongoose'
import { CreateCodeTypeDto, ListCodeTypeRequestDto, UpdateCodeTypeDto } from './codeType.dto'
import { ActionRecordService } from '../action-record/actionRecord.service'

@Injectable()
export class CodeTypeService {
    constructor(
        @InjectModel(CodeType.name) private codeTypeModel: Model<CodeType>,
        private actionRecordService: ActionRecordService
    ) {}

    async findAll(): Promise<CodeType[]> {
        return this.codeTypeModel.find({
            status: 1
        }).exec()
    }

    async create(createData: UpdateCodeTypeDto) {
        const { _id, valueCode, valueName, type } = createData

        const checkData = await this.codeTypeModel.findOne({ valueCode, valueName, type, status: 1})

        if (checkData) {

            await this.actionRecordService.saveRecord({
                actionName: 'Create Code Type',
                actionMethod: 'POST',
                actionFrom: 'Code Type',
                actionData: createData,
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This code type already exist!'
            }
        } else {
            const finalData = {
                valueCode, 
                valueName, 
                type,
                status: 1,
                createdAt: new Date()
            }

            await this.actionRecordService.saveRecord({
                actionName: 'Create Code Type',
                actionMethod: 'POST',
                actionFrom: 'Code Type',
                actionData: finalData,
                actionSuccess: 'Sussess',
                createdAt: new Date()
            })

            const create = new this.codeTypeModel(finalData)
            return await create.save()
        }
    }

    async update(updateData: UpdateCodeTypeDto) {
        const { _id, ...data } = updateData

        const checkData = await this.codeTypeModel.findOne({ _id }).exec()

        if (checkData?.status === 1) {

            const finalData = {
                ...data,
                updatedAt: new Date()
            }

            await this.actionRecordService.saveRecord({
                actionName: 'Update Code Type',
                actionMethod: 'POST',
                actionFrom: 'Code Type',
                actionData: finalData,
                actionSuccess: 'Sussess',
                createdAt: new Date()
            })

            return await this.codeTypeModel.updateOne({ _id}, finalData)
            
        } else {
  
            await this.actionRecordService.saveRecord({
                actionName: 'Update Code Type',
                actionMethod: 'POST',
                actionFrom: 'Code Type',
                actionData: updateData,
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This code type has been invalidated! Please contact admin!'
            }
        }
    }

    async getOneById(_id: string) {
        const data = await this.codeTypeModel.findOne({ _id, status: 1}).exec()

        if (data) {
            return data
        } else {
            return {
                msg: 'This code type has been invalidated! Please contact admin!'
            }
        }
    }

    async invalidateDepartment(_id: string) {
        const checkData = await this.codeTypeModel.findOne({ _id }).exec()

        if (checkData?.status === 0) {

            await this.actionRecordService.saveRecord({
                actionName: 'Void Code Type',
                actionMethod: 'GET',
                actionFrom: 'Code Type',
                actionData: {
                    _id
                },
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This code type has been invalidated! Please contact admin!'
            }
        } else {
            const res = await this.codeTypeModel.updateOne({ _id}, {
                status: 0,
                updateAt: new Date()
            }).exec()
        
            if (res.modifiedCount === 1) {
                await this.actionRecordService.saveRecord({
                    actionName: 'Void Department',
                    actionMethod: 'GET',
                    actionFrom: 'Department',
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

    async getByType(type: string): Promise<CodeType[]> {
        return this.codeTypeModel.find({
            type,
            status: 1
        }).exec()
    }

    async listPageRole(request: ListCodeTypeRequestDto) {
            const { page, limit, name } = request
    
            const skip = (page - 1) * limit
    
            const filters = {
                ...name ? {
                    $or: [
                        {
                            valueName: { $regex: name, $options: 'i' }
                        },
                        {
                            valueName: { $regex: name, $options: 'i' }
                        },
                        {
                            type: { $regex: name, $options: 'i' }
                        }
                    ],
                } : {}, 
                status: 1
            }
    
            const lists = await this.codeTypeModel.find(filters).skip(skip)
                .limit(limit)
                .exec()
            const total = await this.codeTypeModel.countDocuments().exec()
    
            return {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                lists,
            }
    }

    async importData(data: CreateCodeTypeDto[]) {
        for (const item of data) {
            const { valueCode, valueName, type } = item

            const checkData = await this.codeTypeModel.findOne({ valueCode, valueName, type, status: 1 }).exec()

            if (checkData?._id) {
                await this.update({
                    valueCode,
                    valueName,
                    type,
                    _id: checkData._id.toString()
                })
            } else {
                await this.create({
                    valueCode,
                    valueName,
                    type
                })
            }         
        }
    }
}