import { Module } from '@nestjs/common'
import { SysUserService } from './sysUser.service'
import { SysUser, SysUserSchema } from './sysUser.schame'
import { MongooseModule } from '@nestjs/mongoose'
import { SysUserController } from './sysUser.controlller'
import { SysRoleService } from '../sys-role/role.service'
import { SysRole, SysRoleSchema } from '../sys-role/role.schame'
import { ActionRecord, ActionRecordSchema } from '../action-record/actionRecord.schame'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { Department, DepartmentSchema } from '../department/department.schame'
import { LoginRecord, LoginRecordSchema } from './login-reocrd.schame'
import { DepartmentService } from '../department/department.service'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: SysUser.name, schema: SysUserSchema }, 
            { name: SysRole.name, schema: SysRoleSchema },
            { name: ActionRecord.name, schema: ActionRecordSchema },
            { name: Department.name, schema: DepartmentSchema },
            { name: LoginRecord.name, schema: LoginRecordSchema }
        ]),
        SysUser
    ],
    controllers: [SysUserController],
    providers: [SysUserService, SysRoleService, SysRole, ActionRecord, ActionRecordService, DepartmentService],
    exports: [SysUserService, SysUser],
})
export class SysUserMoudule {}