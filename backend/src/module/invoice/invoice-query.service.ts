import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Invoice } from './invoice.schema'
import { Model } from 'mongoose'
import { InvoiceItem } from './invoice-item.schema'
import { InvoicePayment } from './invoice-payment.schema'
import { DashboardReqDto, DashboardReqFilterDto, FinalQuery } from './invoice.dto'
import { groupBy } from 'rxjs'

@Injectable()
export class InvoiceQueryService {
    constructor(
        @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
        @InjectModel(InvoiceItem.name) private invoiceItemModel: Model<InvoiceItem>,
        @InjectModel(InvoicePayment.name) private invoicePaymentModel: Model<InvoicePayment>,
    ) {}

    getFilter(query: DashboardReqFilterDto) {
        const { typeIds, placeIds, deptIds, salesDateRange, productCode, productName } = query

        return {
            ...salesDateRange && salesDateRange.length > 0 ? { 
                'invoice.created_at': { $gte: new Date(salesDateRange[0]), $lte: new Date(salesDateRange[1]) }
            } : {},
            ...typeIds && typeIds.length > 0 ? { 'product.typeId': { $in: typeIds } } : {},
            ...placeIds && placeIds.length > 0 ? { 'invoice.location_id': { $in: placeIds } } : {},
            ...deptIds && deptIds.length > 0 ? { 'product.deptId': { $in: deptIds } } : {},
            ...productCode ? { 'product.productCode': { $regex: productCode, $options: 'i' } } : {},
            ...productName ? { 'product.productName': { $regex: productName, $options: 'i' } } : {},
            'invoice.createdAt': { $ne: null }
        }
    }


    getDeptSet() {
        return {
            lookup: [
                {
                    $lookup: {
                        from: "departments",
                        let: { deptIdStr: { $toObjectId: '$product.deptId' } }, // Convert deptId to ObjectId
                        pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$deptIdStr'] } } }],
                        as: "department"
                    }
                },
                { $unwind: { path: "$department", preserveNullAndEmptyArrays: true } }
            ],
            group: {
                _id: "$department.deptName"
            },
            project: {
                deptName: "$_id"
            },
            sort: {},
        }
    }

    getTypeSet() {
        return {
            lookup: [
                {
                    $lookup: {
                        from: "producttypes",
                        let: { typeIdStr: { $toObjectId: '$product.typeId' } }, // Convert deptId to ObjectId
                        pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$typeIdStr'] } } }],
                        as: "producttype"
                    }
                },
                { $unwind: { path: "$producttype", preserveNullAndEmptyArrays: true } }
            ],
            group: {
                _id: "$producttype.typeName"
            },
            project: {
                typeName: "$_id"
            },
            sort: {},
        }
    }

    getYearMonth() {
        return {
            lookup: [],
            group: {
                _id: {
                    year: { $year: "$invoice.createdAt" },
                    month: {
                      $dateToString: {
                        format: "%B", // month name like "April"
                        date: "$invoice.createdAt"
                      }
                    },
                    monthNum: { $month: "$invoice.createdAt" } // sort month number
                }
            },
            project: {
                year: "$_id.year",
                month: "$_id.month",
            },
            sort: {
                year: 1,
                sortMonth: 1
            },
        }
    }

    getLocationSet() {
        return {
            lookup: [
                {
                    $lookup: {
                        from: "locations",
                        let: { locationIdStr: { $toObjectId: '$invoice.locationId' } }, // Convert deptId to ObjectId
                        pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$locationIdStr'] } } }],
                        as: "location"
                    }
                },
                { $unwind: { path: "$location", preserveNullAndEmptyArrays: true } }
            ],
            group: {
                _id: "$location.placeName"
            },
            project: {
                placeName: "$_id"
            },
            sort: {},
        }
    }


    async getByDataType(query: DashboardReqDto) {
        const { valueField, dataTypeValue, filter } = query

        if (!valueField) return { msg: 'Value Field is required' }
        if (!dataTypeValue) return { msg: 'Data Type is required' }

        let valueFieldObj: any = {}
        let dataTypeObj: any = {}

        switch (dataTypeValue) {
            case 'dept':
                dataTypeObj = this.getDeptSet()
            break

            case 'type':
                dataTypeObj = this.getTypeSet()
            break 

            case 'location':
                dataTypeObj = this.getLocationSet()
            break 

            case 'year-month':
                dataTypeObj = this.getYearMonth()
            break
        }


        switch (valueField) {
            case 'qtys':
                valueFieldObj = {
                    group: { qtys: { $sum: "$qty" } },
                    project: { qtys: 1 },
                    sort: { qtys: -1 }
                }
            break        
            case 'price':
                valueFieldObj = {
                    group: { price: { $sum: "$price" } },
                    project: { price: 1 },
                    sort: { price: -1 }
                }
            break
        }

        const filters: any = this.getFilter(filter)

        return await this.invoiceItemModel.aggregate([
            {
                $lookup: {
                  from: "invoices",
                    let: { invoiceIdStr: { $toObjectId: '$invoiceId' } }, // Convert deptId to ObjectId
                    pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$invoiceIdStr'] } } }],
                    as: "invoice"
                }
            },
            { $unwind: { path: "$invoice", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "products",
                    let: { productIdStr: { $toObjectId: '$productId' } }, // Convert deptId to ObjectId
                    pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$productIdStr'] } } }],
                    as: "product"
                }
            },
            { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
            ...dataTypeObj.lookup,
            {
                $match: filters
            },
            {
                $group: {
                    ...dataTypeObj.group,
                    ...valueFieldObj.group
                }
            },
            {
                $project: {
                    _id: 0,
                    ...dataTypeObj.project,
                    ...valueFieldObj.project
                }
            },
            { $sort: dataTypeObj.sort },
            { $limit: 10 }
        ]).exec()
    }
}