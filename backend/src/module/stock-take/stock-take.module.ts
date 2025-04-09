import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { ActionRecord, ActionRecordSchema } from '../action-record/actionRecord.schame'
import { StockTake, StockTakeSchema } from './stock-take.schema'
import { StockTakeItem, StockTakeItemSchema } from './stock-take-item.schema'
import { StockTakeService } from './stock-take.service'
import { StockTakeController } from './stcok-take.controller'
import { ProductLocation, ProductLocationSchema } from '../product/productLocation.schame'
import { ProductLocationService } from '../product/productLocation.service'
import { Product, ProductSchema } from '../product/product.schame'
import { Location, LocationSchema } from '../location/location.schame'
import { InvRecordService } from '../InvRecord/InvRecord.service'
import { InvRecord, InvRecordSchema } from '../InvRecord/InvRecord.schame'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ActionRecord.name, schema: ActionRecordSchema },
            { name: StockTake.name, schema: StockTakeSchema },
            { name: StockTakeItem.name, schema: StockTakeItemSchema },
            { name: Product.name, schema: ProductSchema },
            { name: Location.name, schema: LocationSchema },
            { name: ProductLocation.name, schema: ProductLocationSchema },
            { name: InvRecord.name, schema: InvRecordSchema }
        ])
    ],
    controllers: [StockTakeController],
    providers: [ActionRecordService, StockTakeService, ProductLocationService, InvRecordService]
})
export class StockTakeMoudule {}