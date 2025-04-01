import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { ProductLocation } from './productLocation.schame'
import { Model } from 'mongoose'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { InsertProductLocationDto } from './product.dto'

@Injectable()
export class ProductLocationService {
    constructor(
        @InjectModel(ProductLocation.name) private productModel: Model<ProductLocation>,
        private actionRecordService: ActionRecordService
    ) {}

    async update(data: InsertProductLocationDto) {
        
    }
}