import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ActionRecord, ActionRecordSchema } from '../action-record/actionRecord.schame'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { ReturnInvoice, ReturnInvoiceSchema } from './returnInvoice.schame'
import { ReturnItem, ReturnItemSchema } from './return-item.schema'
import { ReturnInvoiceService } from './returnInvoice.service'
import { Location, LocationSchema } from '../location/location.schame'
import { Invoice, InvoiceSchema } from '../invoice/invoice.schema'

@Module({
    imports: [MongooseModule.forFeature([
        { name: ReturnInvoice.name, schema: ReturnInvoiceSchema }, 
        { name: ReturnItem.name, schema: ReturnItemSchema }, 
        { name: Location.name, schema: LocationSchema }, 
        { name: ActionRecord.name, schema: ActionRecordSchema },
        { name: Invoice.name, schema: InvoiceSchema}
    ])],
    providers: [ActionRecordService, ReturnInvoiceService],
    exports: [],
    controllers: []
})
export class ReturnInvoiceMoudule {}