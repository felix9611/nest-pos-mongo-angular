import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { ReturnInvoice } from './returnInvoice.schame'
import { ReturnItem } from './return-item.schema'
import { InvoiceListRequestDto, UpdateReturnInvoiceDto } from './returnInvoice.dto'
import { Location } from '../location/location.schame'
import { Invoice } from '../invoice/invoice.schema'

@Injectable()
export class ReturnInvoiceService {
    constructor(
        @InjectModel(ReturnInvoice.name) private returnInvoiceModel: Model<ReturnInvoice>,
        @InjectModel(ReturnItem.name) private returnItemModel: Model<ReturnItem>, 
        @InjectModel(Location.name) private locationModel: Model<Location>,
        @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
        private actionRecordService: ActionRecordService
    ) {}

    async getOneById(_id: string) {
        const baseData = await this.returnInvoiceModel.aggregate([
            { $match: { _id: new Types.ObjectId(_id) } },
            {
                $lookup: {
                    from: 'invoices', // Ensure correct collection name
                    let: { locationIdStr: '$invoiceNumber' }, // Convert deptId to ObjectId
                    pipeline: [{ $match: { $expr: { $eq: ['$number', '$$locationIdStr'] } } }],
                    as: 'invoice'
                }
            },
            { $unwind: { path: '$invoice', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'members',
                    let: { memberIdStr:  { $toObjectId: '$invoice.memberId' } },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$_id', '$$memberIdStr'] },
                                        { $ne: ['$$memberIdStr', null] } // Skip if memberIdStr is null
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'member'
                }
            },
            { $unwind: { path: '$member', preserveNullAndEmptyArrays: true } },
        ])

        const itemData = await this.returnItemModel.aggregate([
            { $match: { returnDataId: new Types.ObjectId(_id) } },
            {
                $lookup: {
                  from: 'products', // Ensure correct collection name
                  let: { productIdStr: { $toObjectId: '$productId' } }, // Convert placeId to ObjectId
                  pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$productIdStr'] } } }],
                  as: 'product'
                }
            },
            { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } }
        ]).exec()

        const mainData = baseData[0]

        return {
            ...mainData,
            returnItems: itemData
        }

    }

    async create(createData: UpdateReturnInvoiceDto) {
        const { returnItems, _id, returnInvoiceNo, returnLocationId, ..._rest } = createData

        const invoiceData = await this.invoiceModel.findOne({ number: returnInvoiceNo }).exec()

        if (!invoiceData) {
            throw new Error('Invoice not found')
        }

        const checkLocationData = await this.locationModel.findOne({ _id: returnLocationId }).exec()

        if (!checkLocationData) {
            throw new Error('Location not found')
        }

        const returnCaseNumber = this.randomNumber()

        const create = new this.returnInvoiceModel({
            ..._rest,
            returnCaseNumber,
            returnLocationId,
            returnDate: new Date(),
            invoiceNumber: returnInvoiceNo,
        })

        const returnInvoiceData = await create.save()

        if (returnInvoiceData) {
            await this.actionRecordService.saveRecord({
                actionName: 'Create Return Record',
                actionMethod: 'POST',
                actionFrom: 'Return Record',
                actionData: returnInvoiceData,
                actionSuccess: 'Success',
                createdAt: new Date()
            })


            const invoiceItemsData = returnItems.map((item) => ({
                ...item,
                returnDataId: returnInvoiceData._id
            }))

            await this.returnItemModel.insertMany(invoiceItemsData)
        }

        return returnInvoiceData

    }

    async listPage(req: InvoiceListRequestDto) {
        const { page, limit, caseNumber, invoiceNumber, dateRange } = req

        const skip = (page - 1) * limit

        const filter = {
            ...caseNumber? { returnCaseNumber: { $regex: caseNumber, $options: 'i' } } : {},
            ...invoiceNumber? { invoiceNumber: { $regex: invoiceNumber, $options: 'i' } } : {},
            ...dateRange? { returnDate: { $gte: dateRange[0], $lte: dateRange[1] } } : {}
        }

        const total = await this.returnInvoiceModel.countDocuments(filter).exec()
        const lists = await this.returnInvoiceModel.aggregate([
            { $match: filter },
            {
                $lookup: {
                    from: 'locations', // Ensure correct collection name
                    let: { locationIdStr: { $toObjectId: '$returnLocationId' } }, // Convert deptId to ObjectId
                    pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$locationIdStr'] } } }],
                    as: 'location'
                }
            },
            { $unwind: { path: '$location', preserveNullAndEmptyArrays: true } },
            {
                $sort: {
                    returnDate:-1 // 1 for ascending, -1 for descending
                }
            },
            { $skip: skip },
            { $limit: limit }
        ])

        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            lists,
        }
    }

    randomNumber() {
        const answer = Math.floor(1000000000 + Math.random() * 9000000000)
        return answer.toString()
    }
}