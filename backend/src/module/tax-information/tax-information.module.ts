import { Module } from '@nestjs/common'
import { TaxInformation, TaxInformationSchema } from './tax-information.schame'
import { MongooseModule } from '@nestjs/mongoose'
import { TaxInformationService } from './tax-information.service'
import { TaxInformationController } from './tax-information.controller'
import { ActionRecord, ActionRecordSchema } from '../action-record/actionRecord.schame'
import { ActionRecordService } from '../action-record/actionRecord.service'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: TaxInformation.name, schema: TaxInformationSchema },
            { name: ActionRecord.name, schema: ActionRecordSchema }
        ])
    ],
    controllers: [TaxInformationController],
    providers: [TaxInformationService, ActionRecordService],
    exports: [],
})
export class TaxInformationMoudule {}