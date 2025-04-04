import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ActionRecord, ActionRecordSchema } from '../action-record/actionRecord.schame'
import { Invoice, InvoiceSchema } from './invoice.schema'
import { InvoiceItem, InvoiceItemSchema } from './invoice-item.schema'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { InvoiceService } from './invoice.servicea'
import { InvoicePayment, InvoicePaymentSchema } from './invoice-payment.schema'
import { InvoiceController } from './invoice.controller'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ActionRecord.name, schema: ActionRecordSchema },
            { name: Invoice.name, schema: InvoiceSchema },
            { name: InvoiceItem.name, schema: InvoiceItemSchema },
            { name: InvoicePayment.name, schema: InvoicePaymentSchema }
        ])
    ],
    controllers: [InvoiceController],
    providers: [ActionRecordService, InvoiceService],
    exports: []
})
export class InvoiceMoudule {}