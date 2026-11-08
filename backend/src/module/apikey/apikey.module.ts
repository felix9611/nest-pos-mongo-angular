import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ActionRecord, ActionRecordSchema } from '../action-record/actionRecord.schame'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { ApiKey, ApiKeySchema } from './apikey.schame'

@Module({
    imports: [MongooseModule.forFeature([{ name: ApiKey.name, schema: ApiKeySchema },{ name: ActionRecord.name, schema: ActionRecordSchema }])],
    providers: [ActionRecordService],
    exports: [],
    controllers: []
})
export class ApiKeyMoudule {}