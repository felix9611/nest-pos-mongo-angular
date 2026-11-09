import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { ApiKey, ApiKeySchema } from './apikey.schame'
import { Model } from 'mongoose'
import { ActionRecordService } from '../action-record/actionRecord.service'

@Injectable()
export class ApiKeyService {
    constructor(
        @InjectModel(ApiKey.name) private codeTypeModel: Model<ApiKey>,
        private actionRecordService: ActionRecordService
    ) {}

    async getKeyData(source: string) {
        const answer = await this.codeTypeModel.findOne({ source, status: 1 }).exec()
        return {
            source: answer?.source,
            key: answer?.key
        }
    }
}