import { IsOptional } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { CommonPageAndList, CommonPageAndListResponse } from 'src/tool/open-api-body'

export interface CreateMemberClassDto {
    classCode: string
    className: string
    remark: string
}

export interface UpdateMemberClassDto extends CreateMemberClassDto {
    _id?: string
}

export interface ListMemberClassRequestDto {
    page: number
    limit: number
    name?: string
}

export class CreateMemberClassBody {

    @ApiProperty({ description: 'Class Code' })
    classCode!: string

    @ApiProperty({ description: 'Class Name' })
    className!: string

    @ApiProperty({ description: 'Remark' })
    remark?: string
}

export class UpdateMemberClassBody extends CreateMemberClassBody {

    @ApiProperty({ description: 'Data Id' })
    _id!: string
}


export class MemberClassBody extends UpdateMemberClassBody {

    @ApiProperty({ description: 'Created At' })
    createdAt!: string

    @ApiProperty({ description: 'Updated At' })
    updatedAt!: string

    @ApiProperty({ description: '1 = Active, 0 = inactive' })  
    status!: number
}

export class ListMemberClassQuery extends CommonPageAndList {
    @ApiProperty({ description: 'For search data keywords' })  
    @IsOptional()
    name?: string
}

export class ListMemberClassQueryRes extends CommonPageAndListResponse {
    @ApiProperty({ type: [MemberClassBody], description: 'Data List' })
    lists?: MemberClassBody[]
}
