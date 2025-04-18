import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { ReturnInvoice } from './returnInvoice.schame'
import { ReturnItem } from './return-item.schema'

@Injectable()
export class ReturnInvoiceService {
    constructor(
        @InjectModel(ReturnInvoice.name) private returnInvoiceModel: Model<ReturnInvoice>,
        @InjectModel(ReturnItem.name) private returnItemModel: Model<ReturnItem>, 
        @InjectModel(Location.name) private locationModel: Model<Location>,
        private actionRecordService: ActionRecordService
    ) {}
}