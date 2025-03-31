import { InjectModel } from '@nestjs/mongoose'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { Injectable } from '@nestjs/common'
import { ExcelFieldMatch } from './excelFieldMatch.schema'
import { Model } from 'mongoose'
import { ExcelFieldMatchListRequestDto, ExcelFieldMatchUpdate } from './excelFieldMatch.dto'


@Injectable()
export class ExcelFieldMatchService {
    constructor(
        @InjectModel(ExcelFieldMatch.name) private excelFieldMatchModel: Model<ExcelFieldMatch>,
        private actionRecordService: ActionRecordService
    ) {}

    async getOneById(_id: string) {
        const data = await this.excelFieldMatchModel.findOne({ _id, status: 1 }).exec()

        if (data) {
            return data
        } else {
            return {
                msg: 'This setting may be invalidated! Please contact admin!'
            }
        }
    }

    async getOneByCode(functionCode: string) {
        const data = await this.excelFieldMatchModel.findOne({ functionCode }).exec()

        if (data?.status === 1) {
            return data
        } else {
            return {
                msg: 'This setting may be invalidated! Please contact admin!'
            }
        }
    }

    async invalidate(_id: string) {
        const checkData = await this.excelFieldMatchModel.findOne({ _id }).exec()

        if (checkData?.status === 0) {
            await this.actionRecordService.saveRecord({
                actionName: 'Void Excel Field Match',
                actionMethod: 'GET',
                actionFrom: 'Excel Field Match',
                actionData: {
                    _id
                },
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This RECORD has been invalidated! Please contact admin!'
            }
        } else {
                await this.excelFieldMatchModel.updateOne({ _id}, {
                    status: 0,
                    updateAt: new Date()
                }).exec()
        
                await this.actionRecordService.saveRecord({
                    actionName: 'Void Excel Field Match',
                    actionMethod: 'GET',
                    actionFrom: 'Excel Field Match',
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

        }
    }

    async create(createData: ExcelFieldMatchUpdate) {
        const { _id, functionCode, functionName, ..._data } = createData

        const checkData = await this.excelFieldMatchModel.findOne({ functionCode, functionName }).exec()

        if (checkData?.status === 1) {
            await this.actionRecordService.saveRecord({
                actionName: 'Create Excel Field Match',
                actionMethod: 'POST',
                actionFrom: 'Excel Field Match',
                actionData: createData,
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This record already exist!'
            }
        } else {

            const finalData = {
                functionCode,
                functionName,
                ..._data,
                status: 1,
                createdAt: new Date()
            }

            await this.actionRecordService.saveRecord({
                actionName: 'Create Excel Field Match',
                actionMethod: 'POST',
                actionFrom: 'Excel Field Match',
                actionData: finalData,
                actionSuccess: 'Sussess',
                createdAt: new Date()
            })

            const create = new this.excelFieldMatchModel(finalData)
            return await create.save()

        }
    }

    async update(updateData: ExcelFieldMatchUpdate) {

        const { _id,  ..._data } = updateData

        const checkData = await this.excelFieldMatchModel.findOne({ _id }).exec()

        if (checkData?.status === 1) {

            const finalData = {
                ..._data,
                updatedAt: new Date()
            }

            await this.actionRecordService.saveRecord({
                actionName: 'Update Excel Field Match',
                actionMethod: 'POST',
                actionFrom: 'Excel Field Match',
                actionData: finalData,
                actionSuccess: 'Sussess',
                createdAt: new Date()
            })

            return await this.excelFieldMatchModel.updateOne({ _id}, finalData).exec()

        } else {

            await this.actionRecordService.saveRecord({
                actionName: 'Update Excel Field Match',
                actionMethod: 'POST',
                actionFrom: 'Excel Field Match',
                actionData: updateData,
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This record has been invalidated! Please contact admin!'
            }
        }

    }

    async listAndPage(req: ExcelFieldMatchListRequestDto) {
        const { page, limit, name, type } = req
    
        const skip = (page - 1) * limit

        const filters = {
            ... name ? { $or: [
                { funcationCode: { $regex: name, $options: 'i'} },
                { funcationName: { $regex: name, $options: 'i'} }
            ] } : {},
            ...type ? { funcationType: type } : {},
            status: 1
        }

        const lists = await this.excelFieldMatchModel.find(filters).skip(skip)
                .limit(limit)
                .exec()
        const total = await this.excelFieldMatchModel.countDocuments().exec()
    
        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            lists
        }

    }
}