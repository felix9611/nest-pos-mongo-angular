import { ApiProperty } from "@nestjs/swagger"
import { CommonPageAndList, CommonPageAndListResponse } from "src/tool/open-api-body"
import { SysRoleBody } from "../sys-role/role.dto"
import { DepartmentBody } from "../department/department.dto"
import { IsOptional } from "@nestjs/class-validator"

export interface CreateUserDto {
    username: string
    password?: string
    avatarBase64?: string
    deptId?: number
    email: string
    roles?: number[]
}

export interface CreateUserRequestDto {
    key: string
    userData: CreateUserDto
}

export interface UpdateUserDto extends CreateUserDto{
    _id: string
}

export interface ListUserRequestDto {
    page: number,
    limit: number,
    deptIds?: number[],
    roleIds?: number[],
    username?: string
}

export class SysUserBody {
    @ApiProperty({ description: 'Username' })
    username!: string

    @ApiProperty({ description: 'Avatar Base64 Data' })
    @IsOptional()
    avatarBase64?: string

    @ApiProperty({ description: 'Department Data Id' })
    @IsOptional()
    deptId?: number

    @ApiProperty({ description: 'Email Address' })
    email?: string

    @ApiProperty({ description: 'User Roles ID List', example: [] })
    @IsOptional()
    roles?: string[]
}

export class CreateUserBody {
    @ApiProperty({ description: 'Create User Key String' })
    key!: string

    @ApiProperty({ description: 'User Data', type: SysUserBody })
    userData!: SysUserBody
}

export class UpdateUserBody extends SysUserBody {
    @ApiProperty({ description: 'Password' })
    password!: string

    @ApiProperty({ description: 'Data Id' })
    _id!: string
}

export class FullUserBody extends UpdateUserBody {
    @ApiProperty({ description: 'Created At' })
    createdAt!: string

    @ApiProperty({ description: 'Updated At' })
    updatedAt!: string

    @ApiProperty({ description: '1 = Active, 0 = inactive' })  
    status!: number
}

export class UserDataWithDepartment extends FullUserBody {
    @ApiProperty({ description: 'Department Data', type: DepartmentBody })
    department?: DepartmentBody
}

export class LoginRecordBody {
    @ApiProperty({ description: 'Data Id' }) 
    _id!: string
    
    @ApiProperty({ description: 'Username' }) 
    username!: string
    
    @ApiProperty({ description: 'Login Time' }) 
    loginTime!: string
    
    @ApiProperty({ description: 'Login Status' }) 
    loginStatus!: string
    
    @ApiProperty({ description: 'IP Address' }) 
    ipAddress!: string
}

export class UserDetailBody extends UserDataWithDepartment {
    @ApiProperty({ description: 'Role Lists', type: SysRoleBody, isArray: true })
    roleLists?: SysRoleBody[]

    @ApiProperty({ description: 'Login Records', type: LoginRecordBody, isArray: true })
    loginRecords?: LoginRecordBody[]
}

export class UpdatePasswordBody {
    @ApiProperty({ description: 'Username' }) 
    username!: string

    @ApiProperty({ description: 'Password' })
    password!: string
}

export class SelfUpdatePasswordBody {
    @ApiProperty({ description: 'Password' })
    password!: string
}

export class UpdateAvatarBody {
    @ApiProperty({ description: 'Username' }) 
    usernames!: string

    @ApiProperty({ description: 'Photo Base64 Data' })
    photos?: string
}

export class ListSysUserQuery extends CommonPageAndList {
    @ApiProperty({ description: 'For search data keywords in username' })  
    usernames?: string

    @ApiProperty({ description: 'For search data keywords in dept data ids' })
    deptIdss?: string[]

    @ApiProperty({ description: 'For search data keywords in role data ids' })
    roleIdss?: string[]
}

export class SysRoleQueryRes extends CommonPageAndListResponse {
    @ApiProperty({ type: UserDataWithDepartment, isArray: true, description: 'Data List' })
    lists?: UserDataWithDepartment[]
}

