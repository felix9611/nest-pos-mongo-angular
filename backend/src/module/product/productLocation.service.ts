import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { ProductLocation } from './productLocation.schame'
import { Model } from 'mongoose'
import { ActionRecordService } from '../action-record/actionRecord.service'
import {  ListProductLocationtRequestDto, StockInOutProductLocationDto, StockMoveProductLocationDto } from './product.dto'
import { Product } from './product.schame'
import { Location } from '../location/location.schame'
import { InvRecordService } from '../InvRecord/InvRecord.service'
import { error } from 'console'

@Injectable()
export class ProductLocationService {
    constructor(
        @InjectModel(ProductLocation.name) private productLocationModel: Model<ProductLocation>,
        @InjectModel(Product.name) private productModel: Model<ProductLocation>,
        @InjectModel(Location.name) private locationModel: Model<Location>,
        private invRecordService: InvRecordService,
        private actionRecordService: ActionRecordService
    ) {}

    async stockMove(data: StockMoveProductLocationDto) {
        const { 
            productCode, 
            productId, 
            qty, 
            fromPlaceCode, 
            fromLocationId,
            toPlaceCode, 
            toLocationId,
            totalCost, 
            totalPrice 
        } = data

        const checkProduct = await this.productModel.findOne({
            ...productCode ? { _id: productId } : {},
            ...productCode ? { productCode } : {},
            status: 1
        })

        const checkFormLocation = await this.locationModel.findOne({
            ...fromLocationId ? { _id: fromLocationId } : {},
            ...fromPlaceCode ? { placeCode: fromPlaceCode } : {},
            status: 1
        })

        const checkToLocation = await this.locationModel.findOne({
            ...toLocationId ? { _id: toLocationId } : {},
            ...toPlaceCode ? { placeCode: toPlaceCode } : {},
            status: 1
        })

        if (!checkProduct) throw new Error('No any product data record!')

        if (!checkFormLocation) throw new Error('No any this location record!')

        if (!checkToLocation) throw new Error('No any this location record!')

        const fromData = await this.productLocationModel.findOne({
            productId: checkProduct._id,
            locationId: checkFormLocation._id
        })

        const toData = await this.productLocationModel.findOne({
            productId: checkProduct._id,
            locationId: checkToLocation._id
        })

        if (fromData) {
            const finalData = {
                qty: fromData.qty - qty,
                totalCost: fromData.totalCost - totalCost,
                totalPrice: fromData.totalPrice - totalPrice
            }

            await this.productLocationModel.updateOne(
                { _id: fromData._id },
                finalData
            )

            await this.invRecordService.insertRecord({
                productId: checkProduct._id.toString(), 
                locFrom: checkFormLocation._id.toString(),
                locTo: checkToLocation._id.toString(),
                qty: qty,
                cost: totalCost,
            })

            if (toData) {
                const updateData = {
                    qty: toData.qty + qty,
                    totalCost: toData.totalCost + totalCost,
                    totalPrice: toData.totalPrice + totalPrice
                }

                await this.actionRecordService.saveRecord({
                    actionName: 'Product Stock Move (Update)',
                    actionMethod: 'POST',
                    actionFrom: 'Stock Move',
                    actionData: {
                        ...updateData,
                        productId: checkProduct._id.toString(), 
                        locationId: checkToLocation._id.toString(),
                    },
                    actionSuccess: 'Success',
                    createdAt: new Date()
                })

                return await this.productLocationModel.updateOne({ _id: toData._id }, updateData)
            } else {
                const createData = {
                    productId: checkProduct._id,
                    locationId: checkToLocation._id,
                    qty: qty,
                    totalCost: totalCost,
                    totalPrice: totalPrice
                }

                await this.actionRecordService.saveRecord({
                    actionName: 'Product Stock Move (Create)',
                    actionMethod: 'POST',
                    actionFrom: 'Stock In',
                    actionData: createData,
                    actionSuccess: 'Success',
                    createdAt: new Date()
                })

                const createRecord = new this.productLocationModel(createData)
                return await createRecord.save()
            }
        }
    }

    async stockOut(data: StockInOutProductLocationDto) {
        const { productCode, productId, placeCode, locationId, qty, totalCost, totalPrice } = data

        const checkProduct = await this.productModel.findOne({
            ...productCode ? { _id: productId } : {},
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
                qty: findOldData.qty - qty,
                totalCost: findOldData.totalCost - totalCost,
                totalPrice: findOldData.totalPrice - totalPrice
            }

            await this.actionRecordService.saveRecord({
                actionName: 'Product Stock Out',
                actionMethod: 'POST',
                actionFrom: 'Stock Out',
                actionData: {
                    ...finalData,
                    productId: checkProduct._id, 
                    locationId: checLocation?._id 
                },
                actionSuccess: 'Success',
                createdAt: new Date()
            })

            await this.invRecordService.insertRecord({
                productId: checkProduct._id.toString(), 
                locFrom: checLocation._id.toString(),
                locTo: '',
                qty: -qty,
                cost: -totalCost,
            })
            
            return await this.productLocationModel.updateOne(
                { _id: findOldData._id },
                finalData
            )


        } else {
            throw new error('No any data record can be change!')
        }
    }

    async stockIn(data: StockInOutProductLocationDto) {
        const { productCode, productId, placeCode, locationId, qty, totalCost, totalPrice } = data

        const checkProduct = await this.productModel.findOne({
            ...productCode ? { _id: productId } : {},
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
                actionData: {
                    ...finalData,
                    productId: checkProduct._id, 
                    locationId: checLocation?._id 
                },
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

            await this.invRecordService.insertRecord({
                productId: checkProduct._id.toString(), 
                locFrom: '',
                locTo: checLocation._id.toString(),
                qty: qty,
                cost: totalCost,
            })


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

    async listPage(req: ListProductLocationtRequestDto) {
        const { page, limit, locatiionIds } = req

        const skip = (page - 1) * limit

        const filters = {
            ...locatiionIds && locatiionIds.length > 0 ? { locatiionId: { $in: locatiionIds} } : {}
        }

        const lists = await this.productLocationModel.find(filters).skip(skip)
                .limit(limit)
                .exec()
        const total = await this.productLocationModel.countDocuments(filters).exec()
    
        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            lists,
        }
    }
}