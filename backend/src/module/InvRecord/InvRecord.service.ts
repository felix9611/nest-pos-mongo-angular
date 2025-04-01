import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { InvRecord } from './InvRecord.schame'
import { InsertInvRecordDto } from './InvRecord.dto'

@Injectable()
export class InvRecordService {
    constructor(
        @InjectModel(InvRecord.name) private invRecordModel: Model<InvRecord>,
        private actionRecordService: ActionRecordService
    ) {}

    async insertRecord(data: InsertInvRecordDto) {
        return await this.invRecordModel.create(data)
    }
}