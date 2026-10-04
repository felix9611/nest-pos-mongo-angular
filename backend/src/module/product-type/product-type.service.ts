import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { ProductType } from './product-type.schame'
import { Model } from 'mongoose'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { CreateproductTypeModelDto, ListproductTypeModelRequestDto, UpdateproductTypeModelDto } from './product-type.dto'

@Injectable()
export class ProductTypeService {
    constructor(
        @InjectModel(ProductType.name) private productTypeModel: Model<ProductType>,
        private actionRecordService: ActionRecordService
    ) {}

    async findAll(): Promise<ProductType[]> {
        return this.productTypeModel.find({
            status: 1
        }).exec()
    }

    async create(createData: UpdateproductTypeModelDto) {
        const { _id, typeCode, typeName, ..._data } = createData

        const checkData = await this.productTypeModel.findOne({ typeCode, typeName, status: 1 }).exec()

        if (checkData?._id) {
            await this.actionRecordService.saveRecord({
                actionName: 'Create Product Type',
                actionMethod: 'POST',
                actionFrom: 'Product Type',
                actionData: createData,
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This product type already exist!'
            }
        } else {
            const finalData = {
                ..._data,
                typeCode, 
                typeName,
                status: 1,
                createdAt: new Date()
            }

            await this.actionRecordService.saveRecord({
                actionName: 'Create Product Type',
                actionMethod: 'POST',
                actionFrom: 'Product Type',
                actionData: finalData,
                actionSuccess: 'Success',
                createdAt: new Date()
            })

            const create = new this.productTypeModel(finalData)
            return await create.save()
        }
    }

    async update(updateData: UpdateproductTypeModelDto) {
        const { _id, ...data } = updateData

        const checkData = await this.productTypeModel.findOne({ _id }).exec()

        if (checkData?.status === 0) {
            await this.actionRecordService.saveRecord({
                actionName: 'Update Location',
                actionMethod: 'POST',
                actionFrom: 'Location',
                actionData: updateData,
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This location has been invalidated! Please contact admin!'
            }
        } else {
            const finalData = {
                ...data,
                updatedAt: new Date()
            }

            await this.actionRecordService.saveRecord({
                actionName: 'Update Product Type',
                actionMethod: 'POST',
                actionFrom: 'Product Type',
                actionData: finalData,
                actionSuccess: 'Sussess',
                createdAt: new Date()
            })

            return await this.productTypeModel.updateOne({ _id }, finalData).exec()
        }
    }

    async getOneById(_id: string) {
        const data = await this.productTypeModel.findOne({ _id, status: 1 }).exec()

        if (data) {
            return data
        } else {
            return {
                msg: 'This Product Type has been invalidated! Please contact admin!'
            }
        }
    }

    async invalidate(_id: string) {
        const checkData = await this.productTypeModel.findOne({ _id }).exec()

        if (checkData?.status === 0) {

            await this.actionRecordService.saveRecord({
                actionName: 'Void Product Type',
                actionMethod: 'GET',
                actionFrom: 'Product Type',
                actionData: {
                    _id
                },
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This Product Type has been invalidated! Please contact admin!'
            }
        } else {
            const res = await this.productTypeModel.updateOne({ _id}, {
                status: 0,
                updateAt: new Date()
            }).exec()
        
            if (res.modifiedCount === 1) {
                await this.actionRecordService.saveRecord({
                    actionName: 'Void Product Type',
                    actionMethod: 'GET',
                    actionFrom: 'Product Type',
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

    async listWithFilters(request: ListproductTypeModelRequestDto) {
        const { name } = request

        const filters = {
            ...name? {
                $or: [
                    {
                        typeName: { $regex: name, $options: 'i' }
                    },
                    {
                        typeCode: { $regex: name, $options: 'i' }
                    },
                    {
                        typeOtherName: { $regex: name, $options: 'i' }
                    }
                ],
            } : {},
            status: 1
        }

        const lists = await this.productTypeModel.find(filters).exec()

        return lists
    }

    async listPage(request: ListproductTypeModelRequestDto) {
        const { page, limit, name } = request

        const skip = (page - 1) * limit

        const filters = {
            ...name? {
                $or: [
                    {
                        typeName: { $regex: name, $options: 'i' }
                    },
                    {
                        typeCode: { $regex: name, $options: 'i' }
                    },
                    {
                        typeOtherName: { $regex: name, $options: 'i' }
                    }
                ],
            } : {},
            status: 1
        }

        const lists = await this.productTypeModel.find(filters).skip(skip)
                .limit(limit)
                .exec()
        const total = await this.productTypeModel.countDocuments().exec()
    
        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            lists,
        }
    }

    async importData(data: CreateproductTypeModelDto[]) {
        for (const item of data) {
            const { typeCode, typeName, ..._data } = item

            const checkData = await this.productTypeModel.findOne({ typeCode, typeName, status: 1 }).exec()

            if (checkData) { 
                await this.update({ typeCode, typeName, ..._data, _id: checkData._id.toString() })
            } else {
                await this.create({ typeCode, typeName, ..._data })
            }
        }
    }
}