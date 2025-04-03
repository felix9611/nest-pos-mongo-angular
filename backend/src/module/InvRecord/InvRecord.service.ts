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
        const { page, limit, dateRange } = dto
        const skip = (page - 1) * limit

        const filter = {
            ...dateRange && dateRange.length > 0 ? { createdAt: { $gte: new Date(dateRange[0]), $lte: new Date(dateRange[1])} } : {}
        }

        const lists = await this.invRecordModel.aggregate([
            { $match: filter },
        
            // Lookup Product
            {
                $lookup: {
                    from: 'products',
                    let: { productIdStr: '$productId' },
                    pipeline: [
                        {
                            $addFields: {
                                productIdObj: {
                                    $convert: {
                                        input: '$$productIdStr',
                                        to: 'objectId',
                                        onError: null,
                                        onNull: null
                                    }
                                }
                            }
                        },
                        { $match: { productIdObj: { $ne: null } } },
                        { $match: { $expr: { $eq: ['$_id', '$productIdObj'] } } }
                    ],
                    as: 'product'
                }
            },
        
            // Lookup locFrom only if it's a valid ObjectId
            {
                $lookup: {
                    from: 'locations',
                    let: { locFromStr: '$locFrom' },
                    pipeline: [
                        {
                            $addFields: {
                                locFromObj: {
                                    $convert: {
                                        input: '$$locFromStr',
                                        to: 'objectId',
                                        onError: null,
                                        onNull: null
                                    }
                                }
                            }
                        },
                        { $match: { locFromObj: { $ne: null } } },
                        { $match: { $expr: { $eq: ['$_id', '$locFromObj'] } } }
                    ],
                    as: 'locFromData'
                }
            },
        
            // Lookup locTo only if it's a valid ObjectId
            {
                $lookup: {
                    from: 'locations',
                    let: { locToStr: '$locTo' },
                    pipeline: [
                        {
                            $addFields: {
                                locToObj: {
                                    $convert: {
                                        input: '$$locToStr',
                                        to: 'objectId',
                                        onError: null,
                                        onNull: null
                                    }
                                }
                            }
                        },
                        { $match: { locToObj: { $ne: null } } },
                        { $match: { $expr: { $eq: ['$_id', '$locToObj'] } } }
                    ],
                    as: 'locToData'
                }
            },
            { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$locFromData', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$locToData', preserveNullAndEmptyArrays: true } },
            { $skip: skip },
            { $limit: limit }
        ]).exec()
        
        
        const total = await this.invRecordModel.find(filter).countDocuments().exec()
    
        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            lists,
        }
    }
}