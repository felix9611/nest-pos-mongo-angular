import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { InvRecord } from './InvRecord.schame'
import { InsertInvRecordDto, ListInvRecordDto } from './InvRecord.dto'

@Injectable()
export class InvRecordService {
    constructor(
        @InjectModel(InvRecord.name) private invRecordModel: Model<InvRecord>,
        private actionRecordService: ActionRecordService
    ) {}

    async insertRecord(data: InsertInvRecordDto) {
        return await this.invRecordModel.create(data)
    }

    async listPage(dto: ListInvRecordDto) {
        const { page, limit } = dto
        const skip = (page - 1) * limit

        const lists = await await this.invRecordModel.aggregate([
            {
                $lookup: {
                    from: 'products', // Ensure correct collection name
                    let: { productIdStr: { $toObjectId: '$productId' } }, // Convert deptId to ObjectId
                    pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$productIdStr'] } } }],
                    as: 'product'
                }
            },
            {
                $lookup: {
                    from: 'locations', // Ensure correct collection name
                    let: { locFromStr: { $toObjectId: '$locFrom' } }, // Convert deptId to ObjectId
                    pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$locFromStr'] } } }],
                    as: 'locFromData'
                }
            },
            {
                $lookup: {
                    from: 'locations', // Ensure correct collection name
                    let: { locToStr: { $toObjectId: '$locTo' } }, // Convert deptId to ObjectId
                    pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$locToStr'] } } }],
                    as: 'locToData'
                }
            },
            { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$locFromData', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$locToData', preserveNullAndEmptyArrays: true } },
            { $skip: skip },
            { $limit: limit }
        ]).exec()
        const total = await this.invRecordModel.countDocuments().exec()
    
        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            lists,
        }
    }
}