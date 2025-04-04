import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Invoice } from './invoice.schema'
import { Model } from 'mongoose'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { InvoiceItem } from './invoice-item.schema'
import { InvoicePayment } from './invoice-payment.schema'
import { CreateInvoiceDto, InvoiceListRequestDto } from './invoice.dto'
import { NEVER } from 'rxjs'


@Injectable()
export class InvoiceService {
    constructor(
        @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
        @InjectModel(InvoiceItem.name) private invoiceItemModel: Model<InvoiceItem>,
        @InjectModel(InvoicePayment.name) private invoicePaymentModel: Model<InvoicePayment>,
        private actionRecordService: ActionRecordService
    ) {}

    async getOneById(_id: string) {
        const baseData = await this.invoiceModel.aggregate([
            { $match: { _id } },
            {
                $lookup: {
                  from: 'members', // Ensure correct collection name
                  let: { memberIdStr: { $toObjectId: '$memberId' } }, // Convert placeId to ObjectId
                  pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$memberIdStr'] } } }],
                  as: 'member'
                }
            },
            { $unwind: { path: '$member', preserveNullAndEmptyArrays: true } },
        ])

        const itemData = await this.invoiceModel.aggregate([
            { $match: { invoiceId: _id } },
            {
                $lookup: {
                  from: 'products', // Ensure correct collection name
                  let: { productIdStr: { $toObjectId: '$productId' } }, // Convert placeId to ObjectId
                  pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$productIdStr'] } } }],
                  as: 'product'
                }
            },
            { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
        ])

        const invoiceData = baseData[0]

        const paymentData = await this.invoicePaymentModel.find({ invoiceId: _id})

        return {
            ...invoiceData,
            invoiceItems: itemData,
            invoicePayment: paymentData
        }
    }

    async create(createData: CreateInvoiceDto) {
        const { invoicePayments, invoiceItems, locationId, locationCode, ..._data } = createData

        const newCode = await this.createNewCode()
        const number = `INV-${newCode}`
        const taxRefNo = this.randomNumber()

        const checkLocation = await this.invoiceModel.findOne({ 
            _id: locationId, 
            placeCode: locationCode
            , status: 1 
        }).exec()

        if (!checkLocation) throw new Error('Location not found!')

        const finalData = {
            number,
            taxRefNo,
            locationId,
            ..._data
        }

        const create = new this.invoiceModel(finalData)
        const res = await create.save()
        if (res) {

            await this.actionRecordService.saveRecord({
                actionName: 'Create Incoice',
                actionMethod: 'POST',
                actionFrom: 'Incoice',
                actionData: finalData,
                actionSuccess: 'Success',
                createdAt: new Date()
            })

            if (invoiceItems && invoiceItems.length > 0) {
                const invoiceItemsData = invoiceItems.map((item) => ({
                    ...item,
                    invoiceId: res._id
                }))

                await this.invoiceItemModel.insertMany(invoiceItemsData)
            }

            if (invoicePayments && invoicePayments.length > 0) {
                const invoicePaymentsData = invoicePayments.map((item) => ({
                    ...item,
                    invoiceId: res._id
                }))

                await this.invoicePaymentModel.insertMany(invoicePaymentsData)
            }

            return res

        } else {
            await this.actionRecordService.saveRecord({
                actionName: 'Create Incoice',
                actionMethod: 'POST',
                actionFrom: 'Incoice',
                actionData: createData,
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'Ooops! Something went wrong! Please try again!'
            }
        }
    }

    async invalidate(_id: string) {
        const checkData = await this.invoiceModel.findOne({ _id }).exec()

        if (checkData?.status === 0) {
            await this.actionRecordService.saveRecord({
                actionName: 'Void Incoice',
                actionMethod: 'GET',
                actionFrom: 'Incoice',
                actionData: {
                    _id
                },
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This invoice has been void! Please contact admin!'
            }
        } else { 
            await this.invoiceModel.updateOne({ _id}, {
                status: 0,
                updateAt: new Date()
            }).exec()
    
            await this.actionRecordService.saveRecord({
                actionName: 'Void Incoice',
                actionMethod: 'GET',
                actionFrom: 'Incoice',
                actionData: {
                    _id,
                    status: 0,
                    updateAt: new Date()
                },
                actionSuccess: 'Success',
                createdAt: new Date()
            })

            return {
              msg: 'Void successfully!'
            }

        }
    }

    async listPage(req: InvoiceListRequestDto) {
        const { page, limit, number, dateRange } = req
        const skip = (page - 1) * limit

        const filter = {
            ...(number ? { number: { $regex: number, $options: 'i' } } : {}),
            ...(dateRange && dateRange.length > 0 ? {  createdAt: { $gte: new Date(dateRange[0]), $lte: new Date(dateRange[1]) } } : {})
        }

        const lists = await this.invoiceModel.aggregate([
            {
                $match: filter
            },
            {
                $lookup: {
                    from: 'locations', // Ensure correct collection name
                    let: { locationIdStr: { $toObjectId: '$locationId' } }, // Convert deptId to ObjectId
                    pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$locationIdStr'] } } }],
                    as: 'location'
                }
            },
            { $unwind: { path: '$location', preserveNullAndEmptyArrays: true } },
            {
                $addFields: {
                  invoiceNum: {
                    $toInt: {
                      $arrayElemAt: [
                        { $split: ['$invoiceNumber', '-'] },
                        1
                      ]
                    }
                  }
                }
            },
            {
                $sort: {
                    invoiceNum: 1 // 1 for ascending, -1 for descending
                }
            },
            { $skip: skip },
            { $limit: limit }
        ]).exec()

        const total = await this.invoiceModel.countDocuments(filter).exec()

        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            lists,
        }
    }

    // Gen number

    randomNumber() {
        const answer = Math.floor(1000000000 + Math.random() * 9000000000)
        return answer.toString()
    }

    formatNumber(num: number, digits: number): string {
        return (num + 1).toString().padStart(digits, '0')
    }

    async createNewCode() {
        const result = await this.invoiceModel.aggregate([
            {
              $addFields: { numberInt: { $toInt: "$number" } } // Convert to integer
            },
            {
              $group: { 
                _id: null, 
                maxNumber: { $max: "numberInt" } // Find max
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
}