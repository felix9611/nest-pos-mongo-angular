import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Product } from './product.schame'
import { Model } from 'mongoose'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { CreateProductDto, ListProductRequestDto, UpdateProductDto } from './product.dto'

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name) private productModel: Model<Product>,
        private actionRecordService: ActionRecordService
    ) {}

    async findAll(): Promise<Product[]> {
        return this.productModel.find({
            status: 1
        }).exec()
    }

    async create(createData: UpdateProductDto) {
        let { _id, productCode, productName, ..._data } = createData

        const checkData = await this.productModel.findOne({ 
            productName,
            status: 1 
        }).exec()

        if (checkData?._id) {
            await this.actionRecordService.saveRecord({
                actionName: 'Create Product',
                actionMethod: 'POST',
                actionFrom: 'Product',
                actionData: createData,
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This product already exist!'
            }
        } else {
            if (!productCode) {
                productCode = await this.createNewCode()
            }


            const finalData = {
                ..._data,
                productCode,
                productName,
                status: 1,
                createdAt: new Date()
            }

            await this.actionRecordService.saveRecord({
                actionName: 'Create Product',
                actionMethod: 'POST',
                actionFrom: 'Product',
                actionData: finalData,
                actionSuccess: 'Success',
                createdAt: new Date()
            })

            const create = new this.productModel(finalData)
            return await create.save()
        }
    }

    async update(updateData: UpdateProductDto) {
        const { _id, ...data } = updateData

        const checkData = await this.productModel.findOne({ _id }).exec()

        if (checkData?.status === 0) {
            await this.actionRecordService.saveRecord({
                actionName: 'Update Product',
                actionMethod: 'POST',
                actionFrom: 'Product',
                actionData: updateData,
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This product has been invalidated! Please contact admin!'
            }
        } else {
            const finalData = {
                ...data,
                updatedAt: new Date()
            }

            await this.actionRecordService.saveRecord({
                actionName: 'Update Product',
                actionMethod: 'POST',
                actionFrom: 'Product',
                actionData: finalData,
                actionSuccess: 'Sussess',
                createdAt: new Date()
            })

            return await this.productModel.updateOne({ _id }, finalData).exec()
        }
    }

    async getOneById(_id: string) {
        const data = await this.productModel.findOne({ _id, status: 1 }).exec()

        if (data) {
            return data
        } else {
            return {
                msg: 'This Product has been invalidated! Please contact admin!'
            }
        }
    }

    async getOneByCode(productCode: string) {
        const data = await this.productModel.findOne({ productCode, status: 1 }).exec()

        if (data) {
            return data
        } else {
            return {
                msg: 'This Product has been invalidated! Please contact admin!'
            }
        }
    }

    async invalidate(_id: string) {
        const checkData = await this.productModel.findOne({ _id }).exec()

        if (checkData?.status === 0) {

            await this.actionRecordService.saveRecord({
                actionName: 'Void Product',
                actionMethod: 'GET',
                actionFrom: 'Product',
                actionData: {
                    _id
                },
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This Product has been invalidated! Please contact admin!'
            }
        } else {
            const res = await this.productModel.updateOne({ _id}, {
                status: 0,
                updateAt: new Date()
            }).exec()
        
            if (res.modifiedCount === 1) {
                await this.actionRecordService.saveRecord({
                    actionName: 'Void Product',
                    actionMethod: 'GET',
                    actionFrom: 'Product',
                    actionData: {
                        _id,
                        status: 0,
                        updateAt: new Date()
                    },
                    actionSuccess: 'Success',
                    createdAt: new Date()
                })


                return {
                  msg: 'Invalidate successfully!'
                }
            } else {
                return {
                  msg: 'Ooops! Something went wrong! Please try again!'
                }
            }
        }
    }

    async listPageRole(request: ListProductRequestDto) {
        const { page, limit, name } = request

        const skip = (page - 1) * limit

        const filters = {
            ...name? { productName: { $regex: name, $options: 'i'} } : {},
            status: 1
        }

        const lists = await this.productModel.find(filters).skip(skip)
                .limit(limit)
                .exec()
        const total = await this.productModel.countDocuments(filters).exec()
    
        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            lists,
        }
    }

    async importData(data: CreateProductDto[]) {
        for (const item of data) {
            const { productCode, productName, ..._data } = item

            const checkData = await this.productModel.findOne({ productCode, productName, status: 1 }).exec()

            if (checkData) { 
                await this.update({ productCode, productName, ..._data, _id: checkData._id.toString() })
            } else {
                await this.create({ productCode, productName, ..._data })
            }
        }
    }

    /// gen new code

    formatNumber(num: number, digits: number): string {
        return (num + 1).toString().padStart(digits, '0')
    }

    async createNewCode() {
        const result = await this.productModel.aggregate([
            {
              $addFields: { assetCodeInt: { $toInt: "$assetCode" } } // Convert to integer
            },
            {
              $group: { 
                _id: null, 
                maxNumber: { $max: "$assetCodeInt" } // Find max
              }
            }
        ]).exec()

        const maxNumber = result.length > 0 ? result[0].maxNumber : 0
        if (maxNumber == null) {
            return this.formatNumber(0, 6)
        } else {
            return this.formatNumber(maxNumber, 6)
        }
    }
}