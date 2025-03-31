import { ApiProperty } from '@nestjs/swagger'
import { CommonPageAndList, CommonPageAndListResponse } from '../../tool/open-api-body'

export interface CreateLocationDto {
    placeCode: string
    placeName: string
    placeOtherName: string
    country: string
    address: string
    zipCode: string
    email: string
    phone: string
    fax: string
    remark: string
}

export interface UpdateLocationDto extends CreateLocationDto {
    _id?: string
}

export interface ListLocationRequestDto {
    page: number
    limit: number
    name?: string
    place?: string
    contact?: string
}