import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Product, ProductSchema } from './product.schame'
import { ProductController } from './product.controller'
import { ActionRecord, ActionRecordSchema } from '../action-record/actionRecord.schame'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { ProductService } from './product.service'
import { ProductLocation, ProductLocationSchema } from './productLocation.schame'
import { ProductLocationService } from './productLocation.service'

@Module({
    imports: [MongooseModule.forFeature([
        { name: Product.name, schema: ProductSchema }, 
        { name: ProductLocation.name, schema: ProductLocationSchema },
        { name: ActionRecord.name, schema: ActionRecordSchema }
    ]), Product],
    providers: [ActionRecordService, ProductService, ProductLocationService],
    exports: [Product],
    controllers: [ProductController]
})
export class ProductMoudule {}