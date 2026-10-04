import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Location } from './location.schame'
import { Model } from 'mongoose'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { CreateLocationDto, ListLocationRequestDto, UpdateLocationDto } from './location.dto'

@Injectable()
export class LocationService {
    constructor(
        @InjectModel(Location.name) private locationModel: Model<Location>,
        private actionRecordService: ActionRecordService
    ) {}

    async findAll(): Promise<Location[]> {
        return this.locationModel.find({
            status: 1
        }).exec()
    }

    async create(createData: UpdateLocationDto) {
        const { _id, placeCode, placeName, ..._data } = createData

        const checkData = await this.locationModel.findOne({ placeCode, placeName, status: 1 }).exec()

        if (checkData?._id) {
            await this.actionRecordService.saveRecord({
                actionName: 'Create Location',
                actionMethod: 'POST',
                actionFrom: 'Location',
                actionData: createData,
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This location already exist!'
            }
        } else {
            const finalData = {
                ..._data,
                placeCode, 
                placeName,
                status: 1,
                createdAt: new Date()
            }

            await this.actionRecordService.saveRecord({
                actionName: 'Create Location',
                actionMethod: 'POST',
                actionFrom: 'Location',
                actionData: finalData,
                actionSuccess: 'Success',
                createdAt: new Date()
            })

            const create = new this.locationModel(finalData)
            return await create.save()
        }
    }

    async update(updateData: UpdateLocationDto) {
        const { _id, ...data } = updateData

        const checkData = await this.locationModel.findOne({ _id }).exec()

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
                actionName: 'Update Location',
                actionMethod: 'POST',
                actionFrom: 'Location',
                actionData: finalData,
                actionSuccess: 'Sussess',
                createdAt: new Date()
            })

            return await this.locationModel.updateOne({ _id }, finalData).exec()
        }
    }

    async getOneById(_id: string) {
        const data = await this.locationModel.findOne({ _id, status: 1 }).exec()

        if (data) {
            return data
        } else {
            return {
                msg: 'This location has been invalidated! Please contact admin!'
            }
        }
    }

    async invalidate(_id: string) {
        const checkData = await this.locationModel.findOne({ _id }).exec()

        if (checkData?.status === 0) {

            await this.actionRecordService.saveRecord({
                actionName: 'Void Location',
                actionMethod: 'GET',
                actionFrom: 'Location',
                actionData: {
                    _id
                },
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This location has been invalidated! Please contact admin!'
            }
        } else {
            const res = await this.locationModel.updateOne({ _id}, {
                status: 0,
                updateAt: new Date()
            }).exec()
        
            if (res.modifiedCount === 1) {
                await this.actionRecordService.saveRecord({
                    actionName: 'Void Location',
                    actionMethod: 'GET',
                    actionFrom: 'Location',
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

    async listWithFilter(request: ListLocationRequestDto) {
        const { name, place, contact } = request

        const filters = {
            ...name? {
                $or: [
                    {
                        placeName: { $regex: name, $options: 'i' }
                    },
                    {
                        placeCode: { $regex: name, $options: 'i' }
                    },
                    {
                        placeOtherName: { $regex: name, $options: 'i' }
                    }
                ],
            } : {},
            ...place ? {
                $or: [
                    {
                        country: { $regex: place, $options: 'i' }
                    },
                    {
                        address: { $regex: place, $options: 'i' }
                    },
                    {
                        zipCode: { $regex: place, $options: 'i' }
                    },
                ]
            } : {},
            ...contact ? {
                $or: [
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

        const lists = await this.locationModel.find(filters).exec()

        return lists
    }

    async listPage(request: ListLocationRequestDto) {
        const { page, limit, name, place, contact } = request

        const skip = (page - 1) * limit

        const filters = {
            ...name? {
                $or: [
                    {
                        placeName: { $regex: name, $options: 'i' }
                    },
                    {
                        placeCode: { $regex: name, $options: 'i' }
                    },
                    {
                        placeOtherName: { $regex: name, $options: 'i' }
                    }
                ],
            } : {},
            ...place ? {
                $or: [
                    {
                        country: { $regex: place, $options: 'i' }
                    },
                    {
                        address: { $regex: place, $options: 'i' }
                    },
                    {
                        zipCode: { $regex: place, $options: 'i' }
                    },
                ]
            } : {},
            ...contact ? {
                $or: [
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

        const lists = await this.locationModel.find(filters).skip(skip)
                .limit(limit)
                .exec()
        const total = await this.locationModel.countDocuments().exec()
    
        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            lists,
        }
    }

    async importData(data: CreateLocationDto[]) {
        for (const item of data) {
            const { placeCode, placeName, ..._data } = item

            const checkData = await this.locationModel.findOne({ placeCode, placeName, status: 1 }).exec()

            if (checkData) {
                await this.update({ placeCode, placeName, ..._data, _id: checkData._id.toString() })
            } else {
                await this.create({ placeCode, placeName, ..._data })
            }
        }
    }
}