import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Invoice } from './invoice.schema'
import { Model } from 'mongoose'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { InvoiceItem } from './invoice-item.schema'
import { InvoicePayment } from './invoice-payment.schema'


@Injectable()
export class InvoiceService {
    constructor(
        @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
        @InjectModel(InvoiceItem.name) private invoiceItemModel: Model<InvoiceItem>,
        @InjectModel(InvoicePayment.name) private invoicePaymentModel: Model<InvoicePayment>,
        private actionRecordService: ActionRecordService
    ) {}

    
}