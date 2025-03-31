import { ApiProperty } from '@nestjs/swagger'
import { CommonPageAndList, CommonPageAndListResponse } from '../../tool/open-api-body'

export interface CreateproductTypeModelDto {
    typeCode: string
    typeName: string
    typeOtherName: string
    remark: string
}

export interface UpdateproductTypeModelDto extends CreateproductTypeModelDto {
    _id?: string
}

export interface ListproductTypeModelRequestDto {
    page: number
    limit: number
    name?: string
}