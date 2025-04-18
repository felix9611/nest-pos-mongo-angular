import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Product, ProductSchema } from './product.schame'
import { ProductController } from './product.controller'
import { ActionRecord, ActionRecordSchema } from '../action-record/actionRecord.schame'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { ProductService } from './product.service'
import { ProductLocation, ProductLocationSchema } from './productLocation.schame'
import { ProductLocationService } from './productLocation.service'
import { InvRecord, InvRecordSchema } from '../InvRecord/InvRecord.schame'
import { InvRecordService } from '../InvRecord/InvRecord.service'
import { Location, LocationSchema } from '../location/location.schame'
import { ProductFile, ProductFileSchema } from './product-file.schame'
import { ProductLocationQueryService } from './productLocation-query.service'
import { ReturnInvoice, ReturnInvoiceSchema } from './returnInvoice.schame'

@Module({
    imports: [MongooseModule.forFeature([
        { name: ReturnInvoice.name, schema: ReturnInvoiceSchema }, 
        { name: ActionRecord.name, schema: ActionRecordSchema },
    ]), Product],
    providers: [ActionRecordService,],
    exports: [],
    controllers: []
})
export class ReturnInvoiceMoudule {}