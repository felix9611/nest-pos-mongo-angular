import { ApiProperty } from '@nestjs/swagger'
import { SysMenuBody } from '../sys-menu/sys-menu.dto'
import { CommonPageAndList, CommonPageAndListResponse } from 'src/tool/open-api-body'

export interface CreateSysRoleDto {
    name: string
    code: string
    remark?: string
    meunIds?: number[]
    read: boolean
    write: boolean
    delete: boolean
    update: boolean
    upload: boolean
}

export interface UpdateSysRoleDto extends CreateSysRoleDto{
    _id: string
}

export interface ListRoleRequestDto {
    page: number,
    limit: number,
    name?: string
}


export class CreateSysRole {
    @ApiProperty({ description: 'Name' })
    name: string

    @ApiProperty({ description: 'Code' })
    code: string

    @ApiProperty({ description: 'Remark' })
    remark: string

    @ApiProperty({ description: 'Menu Id List' })
    meunIds: string[]

    @ApiProperty({ description: 'Read Right' })
    read: boolean

    @ApiProperty({ description: 'Write Right' })
    write: boolean

    @ApiProperty({ description: 'Delete Right' })
    delete: boolean

    @ApiProperty({ description: 'Update Right' })
    update: boolean

    @ApiProperty({ description: 'Upload Right' })
    upload: boolean
}

export class UpdateSysRole extends CreateSysRole {
    @ApiProperty({ description: 'ID' })
    _id: string
}

export class UpdateRoleMenuPermissionBody {
    @ApiProperty({ description: 'ID' })
    id: string

    @ApiProperty({ description: 'Menu ID Lists' })
    menuIds: string[]
}

export class ListPermissionBody {
    @ApiProperty({ description: 'Menu ID Lists' })
    menuIds: string[]
}

export class SysRoleBody extends UpdateSysRole {
    @ApiProperty({ description: 'Status' })
    status: number

    @ApiProperty({ description: 'Created At' })
    createdAt: string

    @ApiProperty({ description: 'Updated At' })
    updatedAt: string
}

export class ListSysRoleQuery extends CommonPageAndList {
    @ApiProperty({ description: 'For search data keywords' })  
    name: string
}


export class SysRoleQueryRes extends CommonPageAndListResponse {
    @ApiProperty({ type: [SysRoleBody], description: 'Data List' })
    lists: SysRoleBody[]
}

export class SysMenuBodyWithPerm extends SysMenuBody {
    @ApiProperty({ description: 'Read Right' })
    read: boolean

    @ApiProperty({ description: 'Write Right' })
    write: boolean

    @ApiProperty({ description: 'Delete Right' })
    delete: boolean

    @ApiProperty({ description: 'Update Right' })
    update: boolean

    @ApiProperty({ description: 'Upload Right' })
    upload: boolean
}


export class SysRoleBodyWithMenu extends SysRoleBody {
    @ApiProperty({ description: 'Menu Lists', type: SysMenuBodyWithPerm, isArray: true })
    menuLists: SysMenuBodyWithPerm[]
}
