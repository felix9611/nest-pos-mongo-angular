import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Product } from './product.schame'
import { Model } from 'mongoose'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { CreateProductDto, ListProductRequestDto, ProductFileDto, UpdateProductDto } from './product.dto'
import { ProductFile } from './product-file.schame'

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name) private productModel: Model<Product>,
        @InjectModel(ProductFile.name) private productFileModel: Model<ProductFile>,
        private actionRecordService: ActionRecordService
    ) {}

    async findAll(): Promise<Product[]> {
        return this.productModel.find({
            status: 1
        }).exec()
    }

    async create(createData: UpdateProductDto) {
        let { _id, productCode, productName, uploaProductFiles, ..._data } = createData

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
            const res = await create.save()

            if (res) {

                if (uploaProductFiles && uploaProductFiles.length > 0) {
                    await this.uploadFile(uploaProductFiles, res._id.toString())
                }

                return res
            } else {
                return {
                    msg: 'Oooops! Something wrong, please try again!'
                }
            }
        }
    }

    async update(updateData: UpdateProductDto) {
        const { _id, uploaProductFiles, ...data } = updateData

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

            const res = await this.productModel.updateOne({ _id }, finalData).exec()

            if (res) {

                if (uploaProductFiles && uploaProductFiles.length > 0) {
                    await this.uploadFile(uploaProductFiles, _id)
                }


                return res
            } else {
                return {
                    msg: 'Oooops! Something wrong, please try again!'
                }
            }
        }
    }

    async getOneById(_id: string) {
        const res: any = await this.productModel.findOne({ _id }).exec()
        if (res?.status === 0) {
            return {
                msg: 'This product maybe voided! Please contact admin!'
            }
        } else {
            res.productFiles = await this.getListFiles(_id)

            return res
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

    async listPage(request: ListProductRequestDto) {
        const { page, limit, name } = request

        const skip = (page - 1) * limit

        const filters = {
            ...name? { productName: { $regex: name, $options: 'i'} } : {},
            status: 1
        }

        const lists = await await this.productModel.aggregate([
            {
                $match: filters
            },
            {
                $lookup: {
                    from: 'departments', // Ensure correct collection name
                    let: { deptIdStr: { $toObjectId: '$deptId' } }, // Convert deptId to ObjectId
                    pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$deptIdStr'] } } }],
                    as: 'department'
                }
            },
            {
                $lookup: {
                    from: 'producttypes', // Ensure correct collection name
                    let: { typeIdStr: { $toObjectId: '$typeId' } }, // Convert deptId to ObjectId
                    pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$typeIdStr'] } } }],
                    as: 'producttype'
                }
            },
            { 
                $addFields: { 
                    productCodeInt: { $toInt: "$productCode" } 
                } 
            },
            { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$producttype', preserveNullAndEmptyArrays: true } },
            { $skip: skip },
            { $limit: limit },
            { $sort: { productCodeInt: 1 } } 
        ]).exec()

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
                await this.create({ _id: '', productCode, productName, ..._data })
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

    // Product File

    async uploadFile(updateFiles: ProductFileDto[], assetId: string) {
        for (const file of updateFiles) {
            await this.actionRecordService.saveRecord({
                actionName: 'Upload Product Files',
                actionMethod: 'POST',
                actionFrom: 'Product(Files)',
                actionData: {
                    assetId,
                    filename: file.fileName,
                    fileType: file.fileType,
                    status: 1
                },
                actionSuccess: 'Sussess',
                createdAt: new Date()
            })

            const create = new this.productFileModel({
                ...file,
                assetId,
                status: 1
            })
            return create.save()
        }
    }

    async getListFiles(assetId: string) {
        const files = await this.productFileModel.find({ assetId, status: 1 }).exec()
        
        if (files.length > 0) {
            return files
        } else {
            return []
        }
    }

    async voidFileById(_id: string) {
        const check = await this.productFileModel.findOne({ _id })

        if (check) {
            const res = await this.productFileModel.updateOne({ _id}, {
                status: 0,
                updateAt: new Date()
            }).exec()
    
            if (res) {
                await this.actionRecordService.saveRecord({
                    actionName: 'Void Product(File)',
                    actionMethod: 'GET',
                    actionFrom: 'Product(File)',
                    actionData: {
                        _id,
                        status: 0,
                        updateAt: new Date()
                    },
                    actionSuccess: 'Success',
                    createdAt: new Date()
                })
    
                return {
                    finished: true,
                    msg: 'Void successfully!'
                }
            }
        } else {
            await this.actionRecordService.saveRecord({
                actionName: 'Void Product(File)',
                actionMethod: 'GET',
                actionFrom: 'Product(File)',
                actionData: {
                    _id
                },
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This file has been void! Please contact admin!'
            }
        }
    }

    async loadFileByAssetId(assetId: string) {
        return this.productFileModel.find({ assetId, status: 1}).exec()
    }
}