import { Injectable } from '@nestjs/common';
import { ActionRecordService } from '../action-record/actionRecord.service'
import { InjectModel } from '@nestjs/mongoose';
import { StockTake } from './stock-take.schema';
import { StockTakeItem } from './stock-take-item.schema';
import { Model } from 'mongoose';
import { ListStockTakeDto, StockTakeForm, StockTakeItemDtoSubmit, UpdateStockTakeForm } from './stock-take.dto';
import { ProductLocation } from '../product/productLocation.schame';
import { ProductLocationService } from '../product/productLocation.service';
import { Product } from '../product/product.schame';

@Injectable()
export class StockTakeService {
    constructor(
        @InjectModel(StockTake.name) private stockTakeModel: Model<StockTake>,
        @InjectModel(StockTakeItem.name) private stockTakeItemModel: Model<StockTakeItem>,
        @InjectModel(ProductLocation.name) private productLocationModel: Model<ProductLocation>,
        @InjectModel(Product.name) private productModel: Model<Product>,
        private actionRecordService: ActionRecordService,
        private productLocationService: ProductLocationService
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

    async getOneStockTake(_id: string) {
        const data = await this.stockTakeModel.findOne({ _id }).exec()

        if (data) {

            const stockTakeItems: any[] = await this.getStockTakeItem(_id)

            return {
                _id: data._id,
                actionName: data.actionName,
                actionPlaceId: data.actionPlaceId,
                remark: data.remark,
                createdTime: data.createdTime,
                finishTime: data.finishTime,
                createBy: data.createBy,
                stockTakeItems,
                status: data.status
            }

        } else {
            return {
                msg: 'This form has been invalidated! Please check again!'
            }
        }
    }

    async update(updateData: UpdateStockTakeForm) {
        const { _id, ..._data } = updateData

        const checkForm = await this.stockTakeModel.findOne({ _id }).exec()

        if (checkForm?.status === 0) {

            await this.actionRecordService.saveRecord({
                actionName: 'Update Stock Take',
                actionMethod: 'POST',
                actionFrom: 'Stock Take',
                actionData: updateData,
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'Ooooops! This stock take form no longer active! Please create a new form!'
            }
        }  else if (checkForm?.status === 2){

            await this.actionRecordService.saveRecord({
                actionName: 'Update Stock Take',
                actionMethod: 'POST',
                actionFrom: 'Stock Take',
                actionData: updateData,
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'Ooooops! This stock take form has been completed! Please create a new form!'
            }
        } else {

            const finalData = {
                ..._data,
                updatedAt: new Date()
            }


            await this.stockTakeModel.updateOne({ _id }, finalData).exec()

            await this.actionRecordService.saveRecord({
                actionName: 'Update Stock Take',
                actionMethod: 'POST',
                actionFrom: 'Stock Take',
                actionData: finalData,
                actionSuccess: 'Success',
                createdAt: new Date()
            })

            return {
                finished: true,
                msg: 'Updated successfully!'
            }

        }
    }

    async finishOrVoid(_id: string, status: number, username?: string) {

        const checkForm = await this.stockTakeModel.findOne({ _id }).exec()

        if (checkForm?.status === 0) {

            await this.actionRecordService.saveRecord({
                actionName: 'Finish Stock Take',
                actionMethod: 'POST',
                actionFrom: 'Stock Take',
                actionData: {
                    _id
                },
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'Ooooops! This stock take form no longer active! Please create a new form!'
            }
        }  else if (checkForm?.status === 2){

            await this.actionRecordService.saveRecord({
                actionName: 'Finish Stock Take',
                actionMethod: 'POST',
                actionFrom: 'Stock Take',
                actionData: {
                    _id
                },
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'Ooooops! This stock take form already completed! Please check again!'
            }
        } else {

            const finalData = {
                status,
                finishBy: username,
                updatedAt: new Date()
            }


            await this.stockTakeModel.updateOne({ _id }, finalData).exec()

            await this.actionRecordService.saveRecord({
                actionName: 'Update Stock Take',
                actionMethod: 'POST',
                actionFrom: 'Stock Take',
                actionData: finalData,
                actionSuccess: 'Success',
                createdAt: new Date()
            })

            return {
                finished: true,
                msg: 'Updated successfully!'
            }

        }
    }

    async stockTakeItemSubmit(data: StockTakeItemDtoSubmit) {

        const oldRecord: any = await this.productLocationModel.findOne(
            {
                productId: data.productId,
                locationId: data.placeId
            }
        )

        let finalStatus = ''

        if (!oldRecord) {

            const product = await this.productModel.findOne({ _id: data.productId }).exec()

            const totalCost = (product?.costPrice ?? 0) * data.qty
            const totalPrice = (product?.retailPrice ?? 0) * data.qty

            const create = new this.productLocationModel({
                productId: data.productId,
                locationId: data.placeId,
                qty: data.qty,
                totalPrice,
                totalCost
            })    
            await create.save()

            finalStatus = 'Created New Stock Record'
        } else if (oldRecord.qty === data.qty) {
            finalStatus = 'Qtys Matched'
        } else if (oldRecord.qty > data.qty || oldRecord.qty < data.qty) {
            finalStatus = 'Qtys No Matched & Updated'

            const product = await this.productModel.findOne({ _id: data.productId }).exec()

            const totalCost = (product?.costPrice ?? 0) * data.qty
            const totalPrice = (product?.retailPrice ?? 0) * data.qty

            await this.productLocationModel.updateOne(
                {
                    _id: oldRecord._id
                },
                {
                    qty: data.qty,
                    totalPrice,
                    totalCost
                }
            ).exec()

        }
    
        const finalData = {
            ...data,
            finalStatus,
            checkTime: new Date()
        }
    
        await this.actionRecordService.saveRecord({
            actionName: 'Submit Stock Take Item',
            actionMethod: 'POST',
            actionFrom: 'Stock Take Item',
            actionData: finalData,
            actionSuccess: 'Success',
            createdAt: new Date()
        })
    
        const create = new this.stockTakeItemModel(finalData)
        return await create.save()
    }

    async listStockTakeForm(query: ListStockTakeDto) {
        const { page, limit, name, placeIds } = query
    
        const skip = (page - 1) * limit
    
        const finalFilter = {
            ...name? {  actionName: { $regex: name, $options: 'i' } } : {},
            ...placeIds && placeIds.length > 0 ? { actionPlaceId: { $in: placeIds } } : {}
        }
    
        const lists = await this.stockTakeModel.aggregate([
            {
                $match: finalFilter
            },
            {
                $lookup: {
                    from: 'locations', // Ensure correct collection name
                    let: { placeIdStr: { $toObjectId: '$actionPlaceId' } }, // Convert actionPlaceId
                    pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$placeIdStr'] } } }],
                    as: 'location'
                }
            },
            { $unwind: { path: '$location', preserveNullAndEmptyArrays: true } },
            { $skip: skip },
            { $limit: limit },
        ]).exec()
    
        const total = await this.stockTakeItemModel.find(finalFilter).countDocuments().exec()
        
        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            lists,
        }
        
    }

    async getStockTakeItem(stockTakeId: string) {
        return await this.stockTakeItemModel.aggregate([
            {
                $match: {
                    stockTakeId
                }
            },
            {
                $lookup: {
                    from: 'products',
                    let: { productIdStr: { $toObjectId: '$productId' } },
                    pipeline: [
                        { 
                            $match: { 
                                $expr: { $eq: ['$_id', '$$productIdStr'] }
                            }
                        },
                    ],
                    as: 'product'
                }
            },
            { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } }
        ]).exec()
    }
}