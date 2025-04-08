import { Injectable } from '@nestjs/common';
import { ActionRecordService } from '../action-record/actionRecord.service'
import { InjectModel } from '@nestjs/mongoose';
import { StockTake } from './stock-take.schema';
import { StockTakeItem } from './stock-take-item.schema';
import { Model } from 'mongoose';
import { StockTakeForm } from './stock-take.dto';

@Injectable()
export class StockTakeService {
    constructor(
        @InjectModel(StockTake.name) private stockTakeModel: Model<StockTake>,
        @InjectModel(StockTakeItem.name) private stockTakeItemModel: Model<StockTakeItem>,
        private actionRecordService: ActionRecordService
    ) {}

    async create(createData: StockTakeForm, username?: string) {
        const { actionName, ..._data } = createData

        const checkData = await this.stockTakeModel.findOne({ actionName, status: 1 }).exec()

        if (checkData) {

            await this.actionRecordService.saveRecord({
                actionName: 'Create Stock Take',
                actionMethod: 'POST',
                actionFrom: 'Stock Take',
                actionData: {
                    ...createData,
                    createBy: username
                },
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This action name already used! Please cehck again!'
            }

        } else {

            const finalData = {
                actionName,
                createBy: username,
                ..._data,
                status: 1,
                createdTime: new Date()
            }

            await this.actionRecordService.saveRecord({
                actionName: 'Create Stock Take',
                actionMethod: 'POST',
                actionFrom: 'Stock Take',
                actionData: finalData,
                actionSuccess: 'Success',
                createdAt: new Date()
            })

            const create = new this.stockTakeModel(finalData)
            return await create.save()
        }
    }
}