import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ActionRecord, ActionRecordSchema } from '../action-record/actionRecord.schame'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { InvRecord, InvRecordSchema } from './InvRecord.schame'
import { InvRecordService } from './InvRecord.service'
import { InventoryRecordController } from './InvRecord.controller'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ActionRecord.name, schema: ActionRecordSchema },
            { name: InvRecord.name, schema: InvRecordSchema }
        ]), 
        InvRecord
    ],
    providers: [ActionRecordService, InvRecordService],
    exports: [InvRecord, InvRecordService],
    controllers: [InventoryRecordController]
})
export class InvRecordMoudule {}