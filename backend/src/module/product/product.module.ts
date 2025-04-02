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

@Module({
    imports: [MongooseModule.forFeature([
        { name: Product.name, schema: ProductSchema }, 
        { name: ProductLocation.name, schema: ProductLocationSchema },
        { name: ActionRecord.name, schema: ActionRecordSchema },
        { name: InvRecord.name, schema: InvRecordSchema },
        { name: Location.name, schema: LocationSchema },
        { name: ProductFile.name, schema: ProductFileSchema }
    ]), Product],
    providers: [ActionRecordService, ProductService, ProductLocationService, InvRecordService],
    exports: [Product],
    controllers: [ProductController]
})
export class ProductMoudule {}