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

export class ImportProductTypeBody {

    @ApiProperty({ description: 'Type Code' })
    typeCode!: string

    @ApiProperty({ description: 'Type Name' })
    typeName!: string

    @ApiProperty({ description: 'Type Other Name' })
    typeOtherName?: string

    @ApiProperty({ description: 'Type for catelog' })
    remark?: string
}

export class CreateProductTypeBody {

    @ApiProperty({ description: 'Type Code' })
    typeCode!: string

    @ApiProperty({ description: 'Type Name' })
    typeName!: string

    @ApiProperty({ description: 'Type Other Name' })
    typeOtherName?: string

    @ApiProperty({ description: 'Type for catelog' })
    remark?: string
}

export class UpdateProductTypeBody extends CreateProductTypeBody {

    @ApiProperty({ description: 'Data Id' })
    _id!: string
}

export class ProductTypeBody extends UpdateProductTypeBody {

    @ApiProperty({ description: 'Created At' })
    createdAt!: string

    @ApiProperty({ description: 'Updated At' })
    updatedAt?: string

    @ApiProperty({ description: '1 = Active, 0 = inactive' })  
    status!: number
}

export class ProductTypeQuery extends CommonPageAndList {
    @ApiProperty({ description: 'For search data keywords' })  
    name?: string
}

export class ListProductTypeQueryRes extends CommonPageAndListResponse {
    @ApiProperty({ type: [ProductTypeBody], description: 'Data List' })
    lists?: ProductTypeBody[]
}