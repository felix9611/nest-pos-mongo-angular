
import { Injectable } from '@nestjs/common'
import { SysUser } from './sysUser.schame'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { CreateUserDto, CreateUserRequestDto, ListUserRequestDto, UpdateUserDto } from './sysUser.dto'
import { createUserKey } from './constants'
import { hashPassword, salt } from '../../tool/password-tools'
import { SysRole } from '../sys-role/role.schame'
import { SysRoleService } from '../sys-role/role.service'
import { Department } from '../department/department.schame'
import { LoginRecord } from './login-reocrd.schame'
import { Location } from '../location/location.schame'

export type User = any

@Injectable()
export class SysUserService {
  constructor(
    @InjectModel(SysUser.name) private sysUserModel: Model<SysUser>,
    @InjectModel(LoginRecord.name) private loginRecordModel: Model<LoginRecord>,
    @InjectModel(Department.name) private departmentModel: Model<Department>,
    @InjectModel(Location.name) private locationModel: Model<Location>,
    private sysRoleService: SysRoleService
  ) {}

  async createUser(createUserRequest: CreateUserRequestDto) {
    const { key, userData } = createUserRequest

    if (key === createUserKey) {
      const checkData = await this.sysUserModel.findOne({ username: userData.username, email: userData.email }).exec()

      if (checkData) {
        return {
          msg: 'The user already exist! Please check again!'
        }
      } else {
        const newPasswordString = hashPassword('888888', salt)

        const finalData: any = {
          username: userData.username,
          password: newPasswordString,
          avatarBase64: userData.avatarBase64,
          email: userData.email,
          deptIds: userData.deptIds,
          placeIds: userData.placeIds,
          roles: userData.roles,
          status: 1,
          createdAt: new Date(),
          updateAt: new Date(),
          superAdmin: userData.superAdmin
        }

        return await this.sysUserModel.create(finalData)
      }

    } else {
      return {
        error: 'Key not match! Please contact admin!'
      }
    }

  }

  async updateUser(userData: UpdateUserDto) {
    const checkData = await this.sysUserModel.findOne({ _id: userData._id }).exec()

    if (checkData?.status === 0) {
      return {
        msg: 'This user has been invalidated! Please contact admin!'
      }
    } else {
      return await this.sysUserModel.updateOne({ _id: userData._id }, {
        ...userData,
        updateAt: new Date()
      }).exec()
    }
  }

  async invalidateUser(_id: string) {
    const checkData = await this.sysUserModel.findOne({ _id }).exec()

    if (checkData?.status === 0) {
      return {
        error: 'This user has been voided! Please contact admin!'
      }
    } else {
      const res = await this.sysUserModel.updateOne({ _id}, {
        status: 0,
        updateAt: new Date()
      }).exec()

      if (res.modifiedCount === 1) {
        return {
          message: 'Voided successfully!'
        }
      } else {
        return {
          message: 'Ooops! Something went wrong! Please try again!'
        }
      }
    }
  }

  async updatePassword(username: string, password: string) {
    const checkData = await this.sysUserModel.findOne({ username }).exec()

    if (checkData) {
      const newPasswordSting = hashPassword(password, salt)

      const res = await this.sysUserModel.updateOne({ username }, { password: newPasswordSting }).exec()

      if (res.modifiedCount === 1) {
        return {
          renew: true,
          message: 'Renew password successfully!'
        }
      } else {
        return {
          renew: false,
          error: 'Ooops! Something went wrong! Please try again!'
        }
      }
    } else {
      return {
        renew: false,
        error: 'This user has been invalidated or does not exist! Please contact admin!'
      }
    }
  }

  async getUserInfo(_id: string) {
    const answer: any = await this.sysUserModel.findOne({ _id}).exec()

    const roleLists = await this.sysRoleService.getRolelistsByIds(answer.roles)

    let departments: any[] = []
    let locations: any[] = []

    departments = await this.departmentModel.find({ _id: { $in: answer.deptIds }, status: 1 }).exec()
    locations = await this.locationModel.find({ _id: { $in: answer.placeIds }, status: 1 }).exec()

    return {
      _id: answer?._id,
      username: answer?.username,
      email: answer?.email,
      avatarBase64: answer?.avatarBase64,
      lastLogin: answer?.lastLogin,
      roles: answer?.roles,
      roleLists,
      deptIds: answer?.deptIds,
      departments: departments,
      placeIds: answer?.placeIds,
      locations:locations,
      superAdmin: answer?.superAdmin
    }

  }

  async findOneUser(username: string) {
    // const answer: any = await this.sysUserModel.findOne({ username })

    const answer = await this.sysUserModel.aggregate([
      {
        $match: {
          username
        }
      },
      {
        $lookup: {
          from: 'departments', // Make sure this matches your DB collection name
          let: { deptIds: { $map: { input: '$deptIds', as: 'deptIds', in: { $toObjectId: '$$deptIds' } } } }, // Convert strings to ObjectIds
          pipeline: [
            { $match: { $expr: { $in: ['$_id', '$$deptIds'] } } }
          ],
          as: 'departments'
        }
      },
      {
        $lookup: {
          from: 'locations', // Make sure this matches your DB collection name
          let: { placeIds: { $map: { input: '$placeIds', as: 'placeIds', in: { $toObjectId: '$$placeIds' } } } }, // Convert strings to ObjectIds
          pipeline: [
            { $match: { $expr: { $in: ['$_id', '$$placeIds'] } } }
          ],
          as: 'locations'
        }
      },
      {
        $lookup: {
          from: 'sysroles', // Make sure this matches your DB collection name
          let: { roleIds: { $map: { input: '$roles', as: 'roleIds', in: { $toObjectId: '$$roleIds' } } } }, // Convert strings to ObjectIds
          pipeline: [
            { $match: { $expr: { $in: ['$_id', '$$roleIds'] } } }
          ],
          as: 'roleLists'
        }
      },
      { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },
    ]).exec()

    const loginRecords = await this.loginRecordModel.find({ username }).sort({ loginTime: -1 }).limit(15).exec()
  
    return {
      ...answer[0],
      loginRecords
    }
  }

  async findOneUserAllData(username: string) {
    const answer: any = await this.sysUserModel.findOne({ username }).exec()

    const roleLists = await this.sysRoleService.getRolelistsByIds(answer.roles)

    let departments: any[] = []
    let locations: any[] = []

    departments = await this.departmentModel.find({ _id: { $in: answer.deptIds }, status: 1 }).exec()
    locations = await this.locationModel.find({ _id: { $in: answer.placeIds }, status: 1 }).exec()

    return {
      _id: answer?._id,
      username: answer?.username,
      email: answer?.email,
      avatarBase64: answer?.avatarBase64,
      lastLogin: answer?.lastLogin,
      roles: answer?.roles,
      roleLists,
      deptIds: answer?.deptIds,
      departments: departments,
      placeIds: answer?.placeIds,
      locations:locations,
      superAdmin: answer?.superAdmin,
      password: answer?.password
    }
  }

  async listUser(request: ListUserRequestDto) {
    const { page, limit, username, roleIds, deptIds } = request

    const skip = (page - 1) * limit

    const filters = {
      ...username ? { name: { $regex: username, $options: 'i' } } : {},
      ...roleIds && roleIds.length > 0 ? { roles: { $in: roleIds} } : {},
      ...deptIds && deptIds.length > 0  ? { deptId: { $in: deptIds} } : {},
      status: 1
    }

    const lists = await this.sysUserModel.aggregate([
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
      { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },
      { $skip: skip },
      { $limit: limit },
    ])
    .exec()

    const total = await this.sysUserModel.find(filters).countDocuments().exec()

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      lists,
    }
  }

  async updateAvatar(username: string, photo: string) {
    const checkData = await this.sysUserModel.findOne({ username }).exec()

    if (checkData?.status === 0 || !checkData) {
      return {
        msg: 'This user has been invalidated! Please contact admin!'
      }
    } else {
      return await this.sysUserModel.updateOne({ _id: checkData._id }, {
        avatarBase64: photo,
        updateAt: new Date()
      })
    }
  }

  async saveLoginRecord(username: string, ipAddress: string, loginStatus: string) {
    const finalData = {
      username,
      loginTime: new Date(),
      ipAddress,
      loginStatus
    }

    const create = new this.loginRecordModel(finalData)
    return await create.save()
  }
}
