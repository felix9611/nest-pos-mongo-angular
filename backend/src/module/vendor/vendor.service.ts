import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Vendor } from './vendor.schame'
import { Model } from 'mongoose'
import { CreateVendorDto, ListVendorRequestDto, UpdateVendorDto } from './vendor.dto';
import { ActionRecordService } from '../action-record/actionRecord.service';

@Injectable()
export class VendorService {
    constructor(
        @InjectModel(Vendor.name) private vendorModel: Model<Vendor>,
        private actionRecordService: ActionRecordService
    ) {}

    async findAll(): Promise<Vendor[]> {
        return this.vendorModel.find({
            status: 1
        }).exec()
    }

    async create(createData: UpdateVendorDto) {
        const { vendorCode, vendorName, _id, ..._data } = createData

        const checkData = await this.vendorModel.findOne({ vendorCode, vendorName, status: 1 }).exec()

        if (checkData) {
            await this.actionRecordService.saveRecord({
                actionName: 'Create Vendor',
                actionMethod: 'POST',
                actionFrom: 'Vendor',
                actionData: createData,
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })


            return {
                msg: 'This vendor already exist!'
            }
        } else {
            const finalData = {
                ..._data,
                vendorCode, 
                vendorName,
                status: 1,
                createdAt: new Date()
            }

            const create = new this.vendorModel(finalData)
            return await create.save()
        }
    }

    async update(updateData: UpdateVendorDto) {
        const { _id, ...data } = updateData

        const checkData = await this.vendorModel.findOne({ _id }).exec()

        if (checkData?.status === 0) {

            await this.actionRecordService.saveRecord({
                actionName: 'Update Vendor',
                actionMethod: 'POST',
                actionFrom: 'Vendor',
                actionData: updateData,
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This vendor has been invalidated! Please contact admin!'
            }
        } else {
            const finalData = {
                ...data,
                updatedAt: new Date()
            }

            await this.actionRecordService.saveRecord({
                actionName: 'Update Vendor',
                actionMethod: 'POST',
                actionFrom: 'Vendor',
                actionData: finalData,
                actionSuccess: 'Sussess',
                createdAt: new Date()
            })

            return await this.vendorModel.updateOne({ _id}, finalData).exec()
        }
    }

    async getOneById(_id: string) {
        const data = await this.vendorModel.findOne({ _id, status: 1 }).exec()

        if (data) {
            return data
        } else {
            return {
                msg: 'This vendor has been invalidated! Please contact admin!'
            }
        }
    }

    async invalidateDepartment(_id: string) {
        const checkData = await this.vendorModel.findOne({ _id }).exec()

        if (checkData?.status === 0) {

            await this.actionRecordService.saveRecord({
                actionName: 'Void Vendor',
                actionMethod: 'GET',
                actionFrom: 'Vendor',
                actionData: {
                    _id
                },
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This vendor has been invalidated! Please contact admin!'
            }
        } else {
            const res = await this.vendorModel.updateOne({ _id}, {
                status: 0,
                updateAt: new Date()
            }).exec()
        
            if (res.modifiedCount === 1) {


                await this.actionRecordService.saveRecord({
                    actionName: 'Void Vendor',
                    actionMethod: 'GET',
                    actionFrom: 'Vendor',
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

    async listPageRole(request: ListVendorRequestDto) {
            const { page, limit, name, place, contact } = request
    
            const skip = (page - 1) * limit
    
            const filters = {
                ...name ? {
                    $or: [
                        {
                            vendorName: { $regex: name, $options: 'i' }
                        },
                        {
                            vendorCode: { $regex: name, $options: 'i' }
                        },
                        {
                            contactPerson: { $regex: name, $options: 'i' }
                        }
                    ]
                } : {},
                ...place ? {
                    address: { $regex: place, $options: 'i' }
                } : {},
                ...contact ? {
                    $or: [
                        {
                            email: { $regex: contact, $options: 'i' }
                        },
                        {
                            phone: { $regex: contact, $options: 'i' }
                        },
                        {
                            fax: { $regex: contact, $options: 'i' }
                        }
                    ]
                } : {},
                status: 1
            }
    
            const lists = await this.vendorModel.find(filters).skip(skip)
                .limit(limit)
                .exec()
            const total = await this.vendorModel.countDocuments().exec()
    
            return {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                lists,
            }
    }

    async importData(data: CreateVendorDto[]) {
        for (const item of data) {
            const { vendorCode, vendorName, ..._dto } = item

            const checkData = await this.vendorModel.findOne({ vendorCode, vendorName, status: 1 }).exec()

            if (checkData) {
                await this.update({
                    vendorCode,
                    vendorName,
                    ..._dto,
                    _id: checkData._id.toString()
                })
            } else {
                await this.create(item)
            }
        }
    }
}