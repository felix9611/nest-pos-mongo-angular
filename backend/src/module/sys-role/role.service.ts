import { Injectable } from '@nestjs/common'
import { SysRole } from './role.schame'
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose'
import { CreateSysRoleDto, ListRoleRequestDto, UpdateSysRoleDto } from './role.dto';
import { ActionRecordService } from '../action-record/actionRecord.service';

@Injectable()
export class SysRoleService {
    constructor(
        @InjectModel(SysRole.name) private sysRoleModel: Model<SysRole>,
        private actionRecordService: ActionRecordService
    ) {}

    async findAll(): Promise<SysRole[]> {
        return this.sysRoleModel.find({
            status: 1
        }).exec()
    }

    async create(createData: UpdateSysRoleDto) {
        const { code, name, _id, ..._data } = createData

        const checkData = await this.checkRoleExist(name, code)

        if (checkData) {

            await this.actionRecordService.saveRecord({
                actionName: 'Create Role',
                actionMethod: 'POST',
                actionFrom: 'Role',
                actionData: createData,
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This role already exist!'
            }
        } else {
            const finalData = {
                name,
                code, 
                ..._data,
                status: 1,
                createdAt: new Date()
            }

           await this.actionRecordService.saveRecord({
                actionName: 'Create Role',
                actionMethod: 'POST',
                actionFrom: 'Role',
                actionData: finalData,
                actionSuccess: 'Sussess',
                createdAt: new Date()
            })

            const created = new this.sysRoleModel(finalData)
            return await created.save()
        }
    }

    async update(updateData: UpdateSysRoleDto) {
        const { _id, code, name, ..._data } = updateData

        const checkData = await this.sysRoleModel.findOne({ _id, status: 1}).exec()
        if (checkData) {
            const finalData = {
                name,
                code, 
                ..._data,
                updatedAt: new Date()
            }

            await this.actionRecordService.saveRecord({
                actionName: 'Update Role',
                actionMethod: 'POST',
                actionFrom: 'Role',
                actionData: finalData,
                actionSuccess: 'Sussess',
                createdAt: new Date()
            })

            return await this.sysRoleModel.updateOne({ _id}, finalData).exec()
        } else {
            await this.actionRecordService.saveRecord({
                actionName: 'Update Role',
                actionMethod: 'POST',
                actionFrom: 'Role',
                actionData: updateData,
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })


            return {
                msg: 'This role has been invalidated! Please contact admin!'
              }
        }
    }

    async updateRoleMenuPermission(_id: string, menuIds: any) {
        const checkData = await this.sysRoleModel.findOne({ _id }).exec()
        if (checkData) {
            const finalData = {
                menuIds,
                updatedAt: new Date()
            }

            await this.actionRecordService.saveRecord({
                actionName: 'Update Role',
                actionMethod: 'POST',
                actionFrom: 'Role',
                actionData: finalData,
                actionSuccess: 'Sussess',
                createdAt: new Date()
            })

            return await this.sysRoleModel.updateOne({ _id}, finalData).exec()

        } else {
            await this.actionRecordService.saveRecord({
                actionName: 'Update Role',
                actionMethod: 'POST',
                actionFrom: 'Role',
                actionData: {
                    menuIds,
                    _id
                },
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This role has been invalidated! Please contact admin!'
            }
        }
    }

    async invalidateRole(_id: string) {
        const checkData = await this.sysRoleModel.findOne({ _id }).exec()

        if (checkData?.status === 0) {
            await this.actionRecordService.saveRecord({
                actionName: 'Void Role',
                actionMethod: 'GET',
                actionFrom: 'Role',
                actionData: {
                    _id
                },
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })


            return {
                msg: 'This role has been invalidated! Please contact admin!'
            }
        } else {
            const res = await this.sysRoleModel.updateOne({ _id}, {
                status: 0,
                updateAt: new Date()
            }).exec()
        
            if (res.modifiedCount === 1) {
                await this.actionRecordService.saveRecord({
                    actionName: 'Void Role',
                    actionMethod: 'GET',
                    actionFrom: 'Role',
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

    async getOneById(_id: string) {
        const data = await this.sysRoleModel.findOne({ _id, status: 1 }).exec()

        if (data) {
            return data
        } else {
            return {
                msg: 'This role has been invalidated! Please contact admin!'
            }
        }
    }

    async listPageRole(request: ListRoleRequestDto) {
        const { page, limit, name } = request

        const skip = (page - 1) * limit

        const filters = {
            ...name ? {
                $or: [
                    {
                        code: { $regex: name, $options: 'i' }
                    },
                    {
                        code: { $regex: name, $options: 'i' }
                    }
                ],
            } : {},
            status: 1
        }

        const lists = await this.sysRoleModel.find(filters).skip(skip)
            .limit(limit)
            .exec()
        const total = await this.sysRoleModel.countDocuments().exec()

        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            lists,
        }
    }

    async getRolelistsByIds(ids: string[]) {
        return await this.sysRoleModel.find({ _id: { $in: ids }, status: 1 }).exec()
    }

    async checkRoleExist(name: string, code: string) {
        return await this.sysRoleModel.findOne({ name, code, status: 1 }).exec()
    }

    async loadRoleWithMenu(roleIds: any) {
        const objectIds = roleIds.map(id => {
            if (id && Types.ObjectId.isValid(id)) {
                return new Types.ObjectId(id);
            }
            throw new Error(`Invalid ObjectId: ${id}`);
        })
    
        return await this.sysRoleModel.aggregate([
            {
                $match: {
                    _id: { $in: objectIds }
                }
            },
            {
                $lookup: {
                    from: 'sysmenus', // Make sure this matches your DB collection name
                    let: {
                        menuIds: {
                            $map: {
                                input: '$menuIds',
                                as: 'menuId',
                                in: { $cond: [{ $ne: ['$$menuId', ''] }, { $toObjectId: '$$menuId' }, null] }
                            }
                        }
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $or: [
                                        { $in: ['$_id', '$$menuIds'] },  // Match _id in menuIds
                                        { $and: [{ $ne: ['$mainId', ''] }, { $in: [{ $toObjectId: '$mainId' }, '$$menuIds'] } ] }  // Match mainId as string directly
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'menuLists'
                }
            },
            {
                $addFields: {
                    "menuLists": {
                        $cond: {
                            if: { $eq: ["$menuLists", []] },
                            then: [],
                            else: {
                                $map: {
                                    input: "$menuLists",
                                    as: "menu",
                                    in: {
                                        $mergeObjects: [
                                            "$$menu",
                                            {
                                                read: "$read",
                                                write: "$write",
                                                delete: "$delete",
                                                update: "$update",
                                                upload: "$upload"
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            }
        ]).exec()
    }
}