import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Vendor, VendorSchema } from './vendor.schame'
import { VendorService } from './vendor.service'
import { VendorController } from './vendor.controller'
import { ActionRecord, ActionRecordSchema } from '../action-record/actionRecord.schame'
import { ActionRecordService } from '../action-record/actionRecord.service'

@Module({
    imports: [MongooseModule.forFeature([{ name: Vendor.name, schema: VendorSchema }, { name: ActionRecord.name, schema: ActionRecordSchema }]), Vendor],
    providers: [VendorService, ActionRecordService],
    exports: [VendorService, Vendor],
    controllers: [VendorController]
})
export class VendorMoudule {}