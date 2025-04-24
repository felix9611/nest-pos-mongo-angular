import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ActionRecord, ActionRecordSchema } from '../action-record/actionRecord.schame'
import { Invoice, InvoiceSchema } from './invoice.schema'
import { InvoiceItem, InvoiceItemSchema } from './invoice-item.schema'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { InvoiceService } from './invoice.service'
import { InvoicePayment, InvoicePaymentSchema } from './invoice-payment.schema'
import { InvoiceController } from './invoice.controller'
import { Product, ProductSchema } from '../product/product.schame'
import { Location, LocationSchema } from '../location/location.schame'
import { ProductLocation, ProductLocationSchema } from '../product/productLocation.schame'
import { ProductLocationService } from '../product/productLocation.service'
import { InvRecord, InvRecordSchema } from '../InvRecord/InvRecord.schame'
import { InvRecordService } from '../InvRecord/InvRecord.service'
import { InvoiceQueryService } from './invoice-query.service'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ActionRecord.name, schema: ActionRecordSchema },
            { name: Invoice.name, schema: InvoiceSchema },
            { name: InvoiceItem.name, schema: InvoiceItemSchema },
            { name: InvoicePayment.name, schema: InvoicePaymentSchema },
            { name: Product.name, schema: ProductSchema },
            { name: Location.name, schema: LocationSchema },
            { name: ProductLocation.name, schema: ProductLocationSchema },
            { name: InvRecord.name, schema: InvRecordSchema }
        ]),
        Invoice
    ],
    controllers: [InvoiceController],
    providers: [ActionRecordService, InvoiceService, ProductLocationService, InvRecordService, InvoiceQueryService],
    exports: [Invoice]
})
export class InvoiceMoudule {}