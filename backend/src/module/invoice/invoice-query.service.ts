import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Invoice } from './invoice.schema'
import { Model } from 'mongoose'
import { InvoiceItem } from './invoice-item.schema'
import { InvoicePayment } from './invoice-payment.schema'
import { DashboardReqDto, DashboardReqFilterDto, FinalQuery } from './invoice.dto'

@Injectable()
export class InvoiceQueryService {
    constructor(
        @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
        @InjectModel(InvoiceItem.name) private invoiceItemModel: Model<InvoiceItem>,
        @InjectModel(InvoicePayment.name) private invoicePaymentModel: Model<InvoicePayment>,
    ) {}

    async queryMakerForDateAndData(query: DashboardReqDto) { 
        const { dataType, dataTypeValue, dateType, dateTypeValue, valueField, filter } = query

        let dataTypeObj: any = {}
        let dateTypeObj: any = {}

        const filters: FinalQuery = filter ? this.getFilter(filter) : { query: {}, productQuery: {} }

    }

    getFilter(query: DashboardReqFilterDto) {
        const { typeIds, placeIds, deptIds, salesDateRange, productCode, productName } = query

        return {
            query: {
                ...salesDateRange && salesDateRange.length > 0 ? { 
                    createdAt: { $gte: new Date(salesDateRange[0]), $lte: new Date(salesDateRange[1]) } 
                } : {},
            },
            productQuery: {
                ...productCode ? { code: { $regex: productCode, $options: 'i' } } : {},
                ...productName ? { name: { $regex: productName, $options: 'i' } } : {},
                ...typeIds && typeIds.length > 0 ? { type: { $in: typeIds } } : {},
                ...placeIds && placeIds.length > 0 ? { place: { $in: placeIds } } : {},
                ...deptIds && deptIds.length > 0 ? { dept: { $in: deptIds } } : {}  
            }
        }
    }
}