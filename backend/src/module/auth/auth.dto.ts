import { ApiProperty } from '@nestjs/swagger'
import { DepartmentBody } from '../department/department.dto'
import { SysRoleBody } from '../sys-role/role.dto'

export class LoginBody {
    @ApiProperty({ description: 'Username' })
    username: string

    @ApiProperty({ description: 'Password' })
    password: string

    @ApiProperty({ description: 'IP Address' })
    ipAddress: string
}

export class TokenBody {
    @ApiProperty({ description: 'Token' })
    accessToken: string
}

export class VerifyTokenRes {
    @ApiProperty({ description: 'Token', example: true })
    status: boolean
}

export class UserDetailDto {
    @ApiProperty({ description: 'ID' })
    _id: string

    @ApiProperty({ description: 'Username' })
    username: string

    @ApiProperty({ description: 'Base64 data of avatar' })
    avatarBase64: string

    @ApiProperty({ description: 'Department ID' })
    deptId: string
    
    @ApiProperty({ description: 'Email Address' })
    email: string

    @ApiProperty({ description: 'User Roles ID List', example: [] })
    roles: any[]

    @ApiProperty({ description: 'Date Time ofLast Login' })
    lastLogin: string

    @ApiProperty({ description: 'User Status' })
    status: number

    @ApiProperty({ description: 'Created At' })
    createdAt: string

    @ApiProperty({ description: 'Updated At' })
    updatedAt: string

    @ApiProperty({ description: 'Department'})
    department: DepartmentBody

    @ApiProperty({ description: 'Role Lists', type: SysRoleBody, isArray: true})
    roleLists: SysRoleBody[]
}