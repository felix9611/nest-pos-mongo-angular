import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { ActionRecord } from './actionRecord.schame'
import { Model } from 'mongoose'
import { ActionRecordCreateDto, ActionRecordListDto } from './actionRecord.dto'

@Injectable()
export class ActionRecordService {
    constructor(
        @InjectModel(ActionRecord.name) private assetTypeModel: Model<ActionRecord>
    ) {}

    async saveRecord(createData: ActionRecordCreateDto) {
        const createRecord = new this.assetTypeModel(createData)
        return await createRecord.save()
    }

    async listAndPage(req: ActionRecordListDto) {
        const { page, limit } = req
        const skip = (page - 1) * limit

        const lists: ActionRecord[] = await this.assetTypeModel.find()
                    .skip(skip)
                    .limit(limit)
                    .exec()
        const total = await this.assetTypeModel.countDocuments().exec()
        
        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            lists
        }
    }
}