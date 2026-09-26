import { IsOptional } from "@nestjs/class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { CommonPageAndList, CommonPageAndListResponse } from "src/tool/open-api-body"
import { MemberClassBody } from "../member-class/member-class.dto"

export interface MemberSpecialDayDto {
    _id?: string
    memberId?: string
    name: string
    date: string
    remark: string
}

export interface CreateMemberDto {
    name: string
    address: string
    phone: string
    email: string
    fax: string
    classId: string
    remark: string
    memberSpecialDays: MemberSpecialDayDto[]
}

export interface UpdateMemberDto extends CreateMemberDto {
    _id?: string
    memberCode?: string
}

export interface ListMemberRequestDto {
    page: number
    limit: number
    name?: string
    contact?: string
    classIds?: string[]
}

export interface ListMemberDto {
    name?: string
}

export class MemberSpecialDayCreateBody {
    @ApiProperty({ description: 'Name' })
    name!: string

    @ApiProperty({ description: 'Date' })
    date!: string

    @ApiProperty({ description: 'Remark' })
    @IsOptional()
    remark?: string  
}

export class MemberSpecialDayBody extends MemberSpecialDayCreateBody {
    @ApiProperty({ description: 'Data Id' })
    _id!: string
    
    @ApiProperty({ description: 'Created At' })
    createdAt!: string 

    @ApiProperty({ description: 'Updated At' })
    updatedAt!: string

    @ApiProperty({ description: '1 = Active, 0 = inactive' })
    status!: number

    @ApiProperty({ description: 'Member ID' })
    memberId!: string
}

export class CreateMemberMainBody {
    @ApiProperty({ description: 'Member Name' })
    name!: string

    @ApiProperty({ description: 'Member Address' })
    address!: string

    @ApiProperty({ description: 'Member Phone No.' })
    phone!: string

    @ApiProperty({ description: 'Member Email' })
    email!: string

    @ApiProperty({ description: 'Member Fax No.' })
    fax?: string

    @ApiProperty({ description: 'Member Class ID' })
    classId?: string

    @ApiProperty({ description: 'Remark' })
    remark?: string
}

export class CreateMemberBody extends CreateMemberMainBody {
    @ApiProperty({ description: 'Member Special Days', type: MemberSpecialDayCreateBody, isArray: true })
    specialDays?: MemberSpecialDayCreateBody[]
}

export class UpdateMemberBody extends CreateMemberMainBody {
    @ApiProperty({ description: 'Member Special Days', type: MemberSpecialDayCreateBody, isArray: true })
    specialDays?: MemberSpecialDayCreateBody[]

    @ApiProperty({ description: 'Member ID' })
    _id!: string

    @ApiProperty({ description: 'Member Code' })
    memberCode!: string
}

export class MemberBody extends CreateMemberMainBody {
    @ApiProperty({ description: 'Member ID' })
    _id!: string

    @ApiProperty({ description: 'Member Code' })
    memberCode!: string
    
    @ApiProperty({ description: 'Created At' })
    createdAt!: string

    @ApiProperty({ description: 'Updated At' })
    updatedAt!: string

    @ApiProperty({ description: '1 = Active, 0 = inactive' })
    status!: number

    @ApiProperty({ description: 'Member Special Days', type: MemberSpecialDayBody, isArray: true })
    memberSpecialDays?: MemberSpecialDayBody[]

    @ApiProperty({ description: 'Member Class', type: () => MemberClassBody })
    memberClass?: MemberClassBody 
}

export class MemberListResponseBody extends CommonPageAndListResponse {
    @ApiProperty({ description: 'List of data', type: MemberBody, isArray: true })
    lists?: MemberBody[]
}

export class MemberListQuery extends CommonPageAndList {
    @ApiProperty({ description: 'For search data keywords' })  
    @IsOptional()
    name?: string

    @ApiProperty({ description: 'For search data keywords' }) 
    @IsOptional() 
    contact?: string

    @ApiProperty({ description: 'For search data keywords' }) 
    @IsOptional()
    classIds?: string[]
}

export class AllMemberListQuery {
    @ApiProperty({ description: 'For search data keywords' })  
    @IsOptional()
    name?: string
}
