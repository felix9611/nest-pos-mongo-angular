import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { ActionRecord, ActionRecordSchema } from '../action-record/actionRecord.schame'
import { ExcelFieldMatch, ExcelFieldMatchSchema } from './excelFieldMatch.schema'
import { ExcelFieldMatchService } from './excelFieldMatch.service'
import { ExcelFieldMatchController } from './excelFieldMatch.controller'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ActionRecord.name, schema: ActionRecordSchema },
            { name: ExcelFieldMatch.name, schema: ExcelFieldMatchSchema }
        ])
    ],
    providers: [ActionRecordService, ExcelFieldMatchService],
    exports: [],
    controllers: [ExcelFieldMatchController]
})
export class ExcelFieldMatchModule {}