import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { ProductLocation } from './productLocation.schame'
import { Model } from 'mongoose'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { StockInProductLocationDto } from './product.dto'
import { Product } from './product.schame'
import { Location } from '../location/location.schame'
import { InvRecordService } from '../InvRecord/InvRecord.service'

@Injectable()
export class ProductLocationService {
    constructor(
        @InjectModel(ProductLocation.name) private productLocationModel: Model<ProductLocation>,
        @InjectModel(Product.name) private productModel: Model<ProductLocation>,
        @InjectModel(Location.name) private locationModel: Model<Location>,
        private invRecordService: InvRecordService,
        private actionRecordService: ActionRecordService
    ) {}

    async stockIn(data:  StockInProductLocationDto) {
        const { productCode, productId, placeCode, locationId, qty, totalCost, totalPrice } = data

        const checkProduct = await this.productModel.findOne({
            ...placeCode ? { _id: productId } : {},
            ...productCode ? { productCode } : {},
            status: 1
        })

        const checLocation = await this.locationModel.findOne({
            ...locationId ? { _id: locationId } : {},
            ...placeCode ? { placeCode, } : {},
            status: 1
        })

        if (!checkProduct) throw new Error('No any product data record!')

        if (!checLocation) throw new Error('No any this location record!')

        const findOldData = await this.productLocationModel.findOne({ 
            productId: checkProduct._id, 
            locationId: checLocation?._id 
        })

        if (findOldData) {
            const finalData = {
                qty: findOldData.qty + qty,
                totalCost: findOldData.totalCost + totalCost,
                totalPrice: findOldData.totalPrice + totalPrice
            }

            await this.actionRecordService.saveRecord({
                actionName: 'Product Stock In (Update)',
                actionMethod: 'POST',
                actionFrom: 'Stock In',
                actionData: finalData,
                actionSuccess: 'Success',
                createdAt: new Date()
            })

            await this.invRecordService.insertRecord({
                productId: checkProduct._id.toString(), 
                locFrom: '',
                locTo: checLocation._id.toString(),
                qty: qty,
                cost: totalCost,
            })
            
            return await this.productLocationModel.updateOne(
                { _id: findOldData._id },
                finalData
            )
        } else {
            const finalData = {
                productId: checkProduct._id, 
                locationId: checLocation._id,
                qty,
                totalCost,
                totalPrice
            }


            await this.actionRecordService.saveRecord({
                actionName: 'Product Stock In (Create)',
                actionMethod: 'POST',
                actionFrom: 'Stock In',
                actionData: finalData,
                actionSuccess: 'Success',
                createdAt: new Date()
            })

            const create = new this.productLocationModel(finalData)
            return await create.save()
        }

    }
}