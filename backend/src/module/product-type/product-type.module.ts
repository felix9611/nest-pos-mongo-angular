import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ProductType, ProductTypeSchema } from './product-type.schame'
import { ProductTypeController } from './product-type.controller'
import { ActionRecord, ActionRecordSchema } from '../action-record/actionRecord.schame'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { ProductTypeService } from './product-type.service'

@Module({
    imports: [MongooseModule.forFeature([
        { name: ProductType.name, schema: ProductTypeSchema }, 
        { name: ActionRecord.name, schema: ActionRecordSchema }
    ]), ProductType],
    providers: [ActionRecordService, ProductTypeService],
    exports: [ProductType],
    controllers: [ProductTypeController]
})
export class ProductTypeMoudule {}