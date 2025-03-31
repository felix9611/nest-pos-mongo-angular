import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CodeType, CodeTypeSchema } from './codeType.schame'
import { CodeTypeService } from './codeType.service'
import { CodeTypeController } from './codeType.controller'
import { ActionRecord, ActionRecordSchema } from '../action-record/actionRecord.schame'
import { ActionRecordService } from '../action-record/actionRecord.service'

@Module({
    imports: [MongooseModule.forFeature([{ name: CodeType.name, schema: CodeTypeSchema }, { name: ActionRecord.name, schema: ActionRecordSchema }]), CodeType],
    providers: [CodeTypeService, ActionRecordService],
    exports: [CodeTypeService, CodeType],
    controllers: [CodeTypeController]
})
export class CodeTypeMoudule {}