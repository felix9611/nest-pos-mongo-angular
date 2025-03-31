import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Department } from './department.schame'
import { Model } from 'mongoose'
import { CreateDeptDto, ListDeptRequestDto, UpdateDeptDto } from './department.dto';
import { ActionRecordService } from '../action-record/actionRecord.service';

@Injectable()
export class DepartmentService {
    constructor(
        @InjectModel(Department.name) private departmentModel: Model<Department>,
        private actionRecordService: ActionRecordService
    ) {}

    async findAll(): Promise<Department[]> {
        return this.departmentModel.find({
            status: 1
        }).exec()
    }

    async create(createData: UpdateDeptDto) {
        const { deptCode, deptName, _id, ..._data } = createData

        const checkData = await this.departmentModel.findOne({ deptCode, deptName, status: 1})

        if (checkData) {
            await this.actionRecordService.saveRecord({
                actionName: 'Create Department',
                actionMethod: 'POST',
                actionFrom: 'Department',
                actionData: createData,
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This department already exist!'
            }
        } else {
            const finalData = {
                ..._data,
                deptCode,
                deptName,
                status: 1,
                createdAt: new Date()
            }

            await this.actionRecordService.saveRecord({
                actionName: 'Create Department',
                actionMethod: 'POST',
                actionFrom: 'Department',
                actionData: finalData,
                actionSuccess: 'Success',
                createdAt: new Date()
            })

            const create = new this.departmentModel(finalData)
            return await create.save()
        }
    }

    async update(updateData: UpdateDeptDto) {
        const { _id, ...data } = updateData

        const checkData = await this.departmentModel.findOne({ _id }).exec()

        if (checkData?.status === 0) {

            await this.actionRecordService.saveRecord({
                actionName: 'Update Department',
                actionMethod: 'POST',
                actionFrom: 'Department',
                actionData: updateData,
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This department has been invalidated! Please contact admin!'
            }
        } else {
            const finalData = {
                ...data,
                updatedAt: new Date()
            }

            await this.actionRecordService.saveRecord({
                actionName: 'Update Department',
                actionMethod: 'POST',
                actionFrom: 'Department',
                actionData: finalData,
                actionSuccess: 'Sussess',
                createdAt: new Date()
            })

            return await this.departmentModel.updateOne({ _id}, finalData).exec()
        }
    }

    async getOneById(_id: string) {
        const data = await this.departmentModel.findOne({ _id, status: 1}).exec()

        if (data) {
            return data
        } else {
            return {
                msg: 'This department has been invalidated! Please contact admin!'
            }
        }
    }

    async invalidateDepartment(_id: string) {
        const checkData = await this.departmentModel.findOne({ _id }).exec()

        if (checkData?.status === 0) {

            await this.actionRecordService.saveRecord({
                actionName: 'Void Department',
                actionMethod: 'GET',
                actionFrom: 'Department',
                actionData: {
                    _id
                },
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This department has been invalidated! Please contact admin!'
            }
        } else {
            const res = await this.departmentModel.updateOne({ _id}, {
                status: 0,
                updateAt: new Date()
            }).exec()
        
            if (res.modifiedCount === 1) {
                await this.actionRecordService.saveRecord({
                    actionName: 'Void Department',
                    actionMethod: 'GET',
                    actionFrom: 'Department',
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

    async listPageRole(request: ListDeptRequestDto) {
            const { page, limit, name } = request
    
            const skip = (page - 1) * limit
    
            const filters = {
                ...name? {
                    $or: [
                        {
                            deptName: { $regex: name, $options: 'i' }
                        },
                        {
                            deptCode: { $regex: name, $options: 'i' }
                        }
                    ],
                } : {},
                status: 1
            }
    
            const lists = await this.departmentModel.find(filters).skip(skip)
                .limit(limit)
                .exec()
            const total = await this.departmentModel.countDocuments().exec()
    
            return {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                lists,
            }
    }

    async importData(data: CreateDeptDto[]) {
        for (const item of data) {
            const { deptCode, deptName, remark } = item
            const checkData = await this.departmentModel.findOne({ deptCode, deptName, status: 1 }).exec()

            if (checkData) {
                await this.update({ deptCode, deptName, remark, _id: checkData._id.toString() })
            } else {
                await this.create({ deptCode, deptName, remark })
            } 
        } 
    }
}