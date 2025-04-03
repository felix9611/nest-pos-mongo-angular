import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ActionRecordService } from 'src/module/action-record/actionRecord.service'
import { MemberClass } from './member-class.schame'

@Injectable()
export class MemberClassService {
    constructor(
        @InjectModel(MemberClass.name) private memberClassModel: Model<MemberClass>,
        private actionRecordService: ActionRecordService
    ) {}

    async findAll(): Promise<MemberClass[]> {
        return this.memberClassModel.find({
            status: 1
        }).exec()
    }
}