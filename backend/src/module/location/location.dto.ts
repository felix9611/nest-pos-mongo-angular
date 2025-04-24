import { ApiProperty } from '@nestjs/swagger'
import { CommonPageAndList, CommonPageAndListResponse } from '../../tool/open-api-body'
import { IsOptional } from '@nestjs/class-validator'

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

export class CreateLocationBody {

    @ApiProperty({ description: 'Locaation Code' })
    placeCode: string

    @ApiProperty({ description: 'Locaation Name' })
    placeName: string

    @ApiProperty({ description: 'Locaation Other Name' })
    placeOtherName: string

    @ApiProperty({ description: 'Country' })
    country: string

    @ApiProperty({ description: 'Address' })
    address: string

    @ApiProperty({ description: 'Zip Code' })
    zipCode: string

    @ApiProperty({ description: 'Email' })
    email: string

    @ApiProperty({ description: 'Phone' })
    phone: string

    @ApiProperty({ description: 'Fax' })
    fax: string

    @ApiProperty({ description: 'Remark' })
    remark: string
}

export class UpdateLocationBody extends CreateLocationBody {

    @ApiProperty({ description: 'Data Id' })
    _id: string
}

export class LocationBody extends UpdateLocationBody {

    @ApiProperty({ description: 'Created At' })
    createdAt: string

    @ApiProperty({ description: 'Updated At' })
    updatedAt: string

    @ApiProperty({ description: '1 = Active, 0 = inactive' })  
    status: number
}

export class ListLocationQuery extends CommonPageAndList {
    @ApiProperty({ description: 'For search data keywords' })  
    @IsOptional()
    name: string

    @ApiProperty({ description: 'For search data keywords' })  
    @IsOptional()
    place: string

    @ApiProperty({ description: 'For search data keywords' })  
    @IsOptional()
    contact: string
}

export class ListLocationQueryRes extends CommonPageAndListResponse {
    @ApiProperty({ type: [LocationBody], description: 'Data List' })
    lists: LocationBody[]
}