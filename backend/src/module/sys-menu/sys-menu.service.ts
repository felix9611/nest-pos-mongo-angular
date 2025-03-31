import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { SysMenu } from './sys-menu.schame'
import { InjectModel } from '@nestjs/mongoose'
import { SysMenuDto, SysMenuList, UpdateSysMenuDto } from './sys-menu.dto'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { SysRole } from '../sys-role/role.schame'

interface MenuItem {
  _id: string;
  createdAt: string;
  status: number;
  mainId: string;
  name: string;
  icon: string;
  path: string;
  sort: number;
  type: number;
  updatedAt: string;
  __v: number;
  children?: MenuItem[];
}

@Injectable()
export class SysMenuService {
  constructor(
      @InjectModel(SysMenu.name) private sysMenuModel: Model<SysMenu>,
      @InjectModel(SysRole.name) private sysRoleModel: Model<SysRole>,
      private actionRecordService: ActionRecordService
  ) {}

  async create(createData: UpdateSysMenuDto) {
    let { mainId, name, _id, ..._data } = createData

    const checkData = await this.sysMenuModel.findOne({ name }).exec()

    if (checkData) {
      await this.actionRecordService.saveRecord({
          actionName: 'Create System Menu',
          actionMethod: 'POST',
          actionFrom: 'System Menu',
          actionData: createData,
          actionSuccess: 'FAILURE',
          createdAt: new Date()
      })

      return {
          msg: 'This System Menu already exist!'
      }
    } else {


      const finalData = {
        ..._data,
        name,
        mainId,
        status: 1,
        createdAt: new Date()
      }

      await this.actionRecordService.saveRecord({
        actionName: 'Create System Menu',
        actionMethod: 'POST',
        actionFrom: 'System Menu',
        actionData: createData,
        actionSuccess: 'Success',
        createdAt: new Date()
      })

      const create = new this.sysMenuModel(finalData)
      return await create.save()
    }
  }

  async update(updateData: UpdateSysMenuDto) {
    const { _id, ...data } = updateData

    const checkData = await this.sysMenuModel.findOne({ _id }).exec()

    if (checkData?.status === 0) {
      await this.actionRecordService.saveRecord({
          actionName: 'Update System Menu',
          actionMethod: 'POST',
          actionFrom: 'System Menu',
          actionData: updateData,
          actionSuccess: 'FAILURE',
          createdAt: new Date()
      })

      return {
          msg: 'This System Menu has been invalidated! Please contact admin!'
      }
    } else {
      const finalData = {
        ...data,
          updatedAt: new Date()
      }

      await this.actionRecordService.saveRecord({
          actionName: 'Update System Menu',
          actionMethod: 'POST',
          actionFrom: 'System Menu',
          actionData: finalData,
          actionSuccess: 'Sussess',
          createdAt: new Date()
      })

      return await this.sysMenuModel.updateOne({ _id}, finalData).exec()
    }
  }

  async getOneById(_id: string) {
    const data = await this.sysMenuModel.findOne({ _id, status: 1 }).exec()

    if (data) {
      return data
    } else {
      return {
        msg: 'This System Menu has been invalidated! Please contact admin!'
      }
    }
  }

  async invalidate(_id: string) {
    const checkData = await this.sysMenuModel.findOne({ _id }).exec()

    if (checkData?.status === 0) {

        await this.actionRecordService.saveRecord({
            actionName: 'Void System Menu',
            actionMethod: 'GET',
            actionFrom: 'System Menu',
            actionData: {
                _id
            },
            actionSuccess: 'FAILURE',
            createdAt: new Date()
        })

        return {
            msg: 'This System Menu has been invalidated! Please contact admin!'
        }
    } else {
        const res = await this.sysMenuModel.updateOne({ _id}, {
            status: 0,
            updateAt: new Date()
        }).exec()
    
        if (res.modifiedCount === 1) {
            await this.actionRecordService.saveRecord({
                actionName: 'Void System Menu',
                actionMethod: 'GET',
                actionFrom: 'System Menu',
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

  async listAllMainIdMenu() {
    return await this.sysMenuModel.aggregate([
      {
        $match: { mainId: '' } // WHERE mainId = 0 AND type = 0
      },
      {
        $group: {
          _id: { mainId: '$mainId', name: '$name' }, // GROUP BY mainId, name
          _idValue: { $first: '$_id' } // Keep a unique _id
        }
      },
      {
        $project: {
          _id: '$_idValue',
          mainId: '$_id.mainId',
          name: '$_id.name'
        }
      }
    ]).exec()
  }

  async listAllMenu(query: SysMenuList) {
    const result: any = await this.sysMenuModel.find(
      {
        name: { $regex: query.name, $options: 'i'}
      }
    ).exec()
    const plainResult = result.map(doc => doc.toObject())
    const answer = this.buildSortedTree(plainResult)
    return answer
  }


  async getTreeAllMenuById(ids: string[]) {
      const result: any = await this.sysMenuModel.find({ status: 1, $or: [
        { _id: { $in: ids} },
        { mainId:{ $in: ids}  }
      ]}).exec()  // GET first round datas

      const initialIds = [...new Set(
        result
          .map((record: any) => record.mainId)
          .filter((mainId: any) => mainId !== '')
      )] // GET first round ids
      const additionalRecords = await this.sysMenuModel.find({
        status: 1,
      _id: { $in: initialIds }
      }).exec() // GET second round data

      const finalResult = Array.from(
        new Map(
          [...result, ...additionalRecords].map(doc => [doc._id.toString(), doc])
        ).values()
      ) // first round datas + second round data

    const plainResult = finalResult.map(doc => doc.toObject())
    const final = this.buildSortedTree(plainResult) // tree finalResult

    return final
  }


  async getTreeAllMenuRoleById(ids: string[], roleIds: string[]) {

    const vaildRole = await this.sysRoleModel.find({ _id: { $in: roleIds }}).exec()

    if (vaildRole.length === 0) {
      throw new Error('No valid role found!')
    } else {
      const vaildRoleIds = vaildRole.map((item: any) => item._id.$toString())

      const result: any = await this.sysMenuModel.aggregate([
        {
          $match: { 
            status: 1, 
              $or: [
              { _id: { $in: ids} },
              { mainId:{ $in: ids}  }
            ]
          }
        },
        {
          $lookup: {
            from: 'sysroles',
            let: { idStr: { $toObjectId: '$_id' }, mainId: "$mainId" },
            pipeline: [
              {
                $match: {
                  _id: { $in: vaildRoleIds },
                  $expr: {
                    $or: [
                      { $in: ['$$idStr', '$menuIds'] },
                      { $in: ['$$mainId', '$menuIds'] },
                    ]
                  }
                }
              }
            ],
            as: 'role'
          }
        },
        { $unwind: { path: '$role', preserveNullAndEmptyArrays: true } }
      ]).exec()
  
      return result
    }
  }

  async getAllMenu() {
    return await this.sysMenuModel.aggregate([
      {
        $match: {
          status: 1
        }
      },
      {
        $sort: {
          sort: 1
        }
      }
    ]).exec()
  }

  buildSortedTree(data: any[]) {
    const map = new Map<string, any>()
    const tree: any[] = []
  
    // Initialize Map with full item data and empty children array
    data.forEach(item => {
      map.set(String(item._id), { ...item, expand: false, childrens: [] }) // Ensure _id is a string
    });
  
    // Build tree structure by linking children
    data.forEach(item => {
      const parentId = String(item.mainId) // Ensure mainId is also a string
      if (parentId && map.has(parentId)) {
        map.get(parentId)!.childrens!.push(map.get(String(item._id))!)
      } else {
        tree.push(map.get(String(item._id))!)
      }
    })
  
    // Recursive function to sort tree nodes
    function sortTree(nodes: any[]) {
      nodes.sort((a, b) => a.sort - b.sort) // Sort at the current level
      nodes.forEach(node => {
        if (node.childrens && node.childrens.length > 0) {
          sortTree(node.childrens) // Recursively sort children
        }
      })
    }
  
    sortTree(tree) // Sort root level and all nested levels
  
    return tree
  } 

  buildSortedTreeShort(data: any[]) {
    const map = new Map<string, any>()
    const tree: any[] = []
  
    // Initialize Map with full item data and empty children array
    data.forEach(item => {
      map.set(String(item._id), { title: item.name, key: item._id, children: [] }) // Ensure _id is a string
    });
  
    // Build tree structure by linking children
    data.forEach(item => {
      const parentId = String(item.mainId) // Ensure mainId is also a string
      if (parentId && map.has(parentId)) {
        map.get(parentId)!.children!.push(map.get(String(item._id))!)
      } else {
        tree.push(map.get(String(item._id))!)
      }
    })
  
    // Recursive function to sort tree nodes
    function sortTree(nodes: any[]) {
      nodes.sort((a, b) => a.sort - b.sort) // Sort at the current level
      nodes.forEach(node => {
        if (node.childrens && node.childrens.length > 0) {
          sortTree(node.childrens) // Recursively sort children
        }
      })
    }
  
    sortTree(tree) // Sort root level and all nested levels
  
    return tree
  }
  
}