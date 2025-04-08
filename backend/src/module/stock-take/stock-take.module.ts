import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { ActionRecord, ActionRecordSchema } from '../action-record/actionRecord.schame'
import { StockTake, StockTakeSchema } from './stock-take.schema'
import { StockTakeItem, StockTakeItemSchema } from './stock-take-item.schema'
import { StockTakeService } from './stock-take.service'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ActionRecord.name, schema: ActionRecordSchema },
            { name: StockTake.name, schema: StockTakeSchema },
            { name: StockTakeItem.name, schema: StockTakeItemSchema }
        ])
    ],
    controllers: [],
    providers: [ActionRecordService, StockTakeService]
})
export class StockTakeMoudule {}