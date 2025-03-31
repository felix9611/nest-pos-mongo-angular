import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { SysRole, SysRoleDocument, SysRoleSchema } from './role.schame'
import { SysRoleService } from './role.service'
import { SysRoleController } from './role.controller'
import { ActionRecord, ActionRecordSchema } from '../action-record/actionRecord.schame'
import { ActionRecordService } from '../action-record/actionRecord.service'

@Module({
    imports: [MongooseModule.forFeature([{ name: SysRole.name, schema: SysRoleSchema }, { name: ActionRecord.name, schema: ActionRecordSchema }]), SysRole],
    controllers: [SysRoleController],
    providers: [SysRoleService, ActionRecordService],
    exports: [SysRoleService, SysRole],
})
export class SysRoleMoudule {}