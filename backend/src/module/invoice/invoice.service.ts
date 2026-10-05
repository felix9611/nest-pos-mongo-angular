import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Invoice } from './invoice.schema'
import { Model, Types } from 'mongoose'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { InvoiceItem } from './invoice-item.schema'
import { InvoicePayment } from './invoice-payment.schema'
import { CreateInvoiceDto, InvoiceListRequestDto } from './invoice.dto'
import { NEVER } from 'rxjs'
import { ProductLocationService } from '../product/productLocation.service'


@Injectable()
export class InvoiceService {
    constructor(
        @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
        @InjectModel(InvoiceItem.name) private invoiceItemModel: Model<InvoiceItem>,
        @InjectModel(InvoicePayment.name) private invoicePaymentModel: Model<InvoicePayment>,
        private productLocationService: ProductLocationService,
        private actionRecordService: ActionRecordService
    ) {}

    async getOneByNumber(number:  string) {
        const baseData = await this.invoiceModel.aggregate([
            { $match: { number }},
            {
                $lookup: {
                    from: 'members',
                    let: { memberIdStr: { $toObjectId: { $cond: { if: '$hasMemberId', then: '$memberId', else: null } } } },
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
        ]).exec()

        const invoiceData = baseData[0]

        const itemData = await this.invoiceItemModel.aggregate([
            { $match: { invoiceId: invoiceData._id } },
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

    
        const paymentData = await this.invoicePaymentModel.find({ invoiceId: invoiceData._id }).exec()

        return {
            ...invoiceData,
            invoiceItems: itemData,
            invoicePayments: paymentData
        }
    }

    async getOneById(_id: string) {
        const baseData = await this.invoiceModel.aggregate([
            { $match: { _id: new Types.ObjectId(_id) } },
            {
                $lookup: {
                    from: 'members',
                    let: { memberIdStr: { $toObjectId: { $cond: { if: '$hasMemberId', then: '$memberId', else: null } } } },
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
        ]).exec()

        const itemData = await this.invoiceItemModel.aggregate([
            { $match: { invoiceId: new Types.ObjectId(_id) } },
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

        const invoiceData = baseData[0]

        const paymentData = await this.invoicePaymentModel.find({ invoiceId: new Types.ObjectId(_id) }).exec()

        return {
            ...invoiceData,
            invoiceItems: itemData,
            invoicePayments: paymentData
        }
    }

    async create(createData: CreateInvoiceDto) {
        const { invoicePayments, invoiceItems, locationId, locationCode, ..._data } = createData

        const newCode = await this.createNewCode()
        const number = `INV-${newCode}`
        const taxRefNo = this.randomNumber()

  /*      const checkLocation = await this.invoiceModel.findOne({ 
            _id: locationId, status: 1 
        }).exec()

        if (!checkLocation) {
            throw new Error('Location not found!')
        } */

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
                    discount: item.discountType === '%' ? item.discount / 100 : item.discount,
                    invoiceId: res._id
                }))

                await this.invoiceItemModel.insertMany(invoiceItemsData)

                for (const item of invoiceItemsData) {
                    await this.productLocationService.stockOut({
                        productCode: item.productCode,
                        productId: item.productId,
                        locationId,
                        qty: item.qty,
                        totalCost: item.price,
                        totalPrice: item.price,
                        placeCode: ''
                    })
                }
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

    async listWithFilter(req: InvoiceListRequestDto) {
        const { number, dateRange } = req

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
                        { $split: ['$number', 'INV-'] },
                        1
                      ]
                    }
                  }
                }
            },
            {
                $sort: {
                    invoiceNum: -1 // 1 for ascending, -1 for descending
                }
            },
        ]).exec()

        const newLists = lists.map((item) => {
            return {
                ...item,
                locationCode: item.location?.placeCode ?? '',
                locationName: item.location?.placeName ?? ''
            }
        })

        return newLists
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
                        { $split: ['$number', 'INV-'] },
                        1
                      ]
                    }
                  }
                }
            },
            {
                $sort: {
                    invoiceNum: -1 // 1 for ascending, -1 for descending
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

    async createNewCode(): Promise<string> {
        try {
            const result = await this.invoiceModel.aggregate([
                {
                    $match: {
                        number: { $regex: new RegExp('^[iI][nN][vV]-\\d+') }
                    }
                },
                {
                    $addFields: {
                        numberInt: {
                            $cond: {
                                if: { $regexMatch: { input: '$number', regex: /^[iI][nN][vV]-\d+$/ } },
                                then: {
                                    $toInt: {
                                        $substr: ['$number', 4, -1]
                                    }
                                },
                                else: 0
                            }
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        maxNumber: { $max: '$numberInt' }
                    }
                }
            ]).exec();
    
            const maxNumber = result.length > 0 && result[0].maxNumber !== null 
                ? result[0].maxNumber 
                : 0;
            console.log('Max number found:', maxNumber)
    
            const nextNumber = maxNumber
            const newCode = this.formatNumber(nextNumber, 6)
            return newCode
        } catch (error) {
            throw new Error('Failed to generate new invoice code')
        }
    }
}