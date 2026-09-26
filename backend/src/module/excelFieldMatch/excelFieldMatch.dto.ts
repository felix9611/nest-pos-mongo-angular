import { IsOptional } from "@nestjs/class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { CommonPageAndList, CommonPageAndListResponse } from "src/tool/open-api-body"

export interface ExcelFieldList {
    dbFieldName: string
    excelFieldName: string
    sort: number
}

export interface ExcelFieldMatchCreate {
    functionCode: string
    functionName: string
    functionType: string
    fieldLists?: ExcelFieldList[]
}

export interface ExcelFieldMatchUpdate extends ExcelFieldMatchCreate {
    _id: string
}

export interface ExcelFieldMatchListRequestDto {
    page: number
    limit: number
    name?: string
    type?: string
}

export class ExcelFieldListBody {
    @ApiProperty({ description: 'Datebase field name' })
    dbFieldName?: string

    @ApiProperty({ description: 'Excel field name' })
    excelFieldName?: string

    @ApiProperty({ description: 'Sort number' })
    sort?: number
}

export class ExcelFieldMatchCreateBody {
    @ApiProperty({ description: 'Function Code' })
    functionCode!: string

    @ApiProperty({ description: 'Function Name' })
    functionName!: string

    @ApiProperty({ description: 'Function Type' })
    functionType!: string

    @ApiProperty({ description: 'Created At', type: ExcelFieldListBody, isArray: true })
    fieldLists?: ExcelFieldList[]
}

export class ExcelFieldMatchUpdateBody extends ExcelFieldMatchCreateBody {
    @ApiProperty({ description: 'Data Id' })
    _id!: string
}

export class ExcelFieldMatchBody extends ExcelFieldMatchUpdateBody {
    @ApiProperty({ description: 'Created At' })
    createdAt!: string

    @ApiProperty({ description: 'Updated At' })
    updatedAt?: string

    @ApiProperty({ description: '1 = Active, 0 = inactive' })  
    status!: number
}

export class ExcelFieldMatchListResponseBody extends CommonPageAndListResponse {
    @ApiProperty({ description: 'List of data', type: ExcelFieldMatchBody, isArray: true })
    list?: ExcelFieldMatchBody[]
}

export class ExcelFieldMatchListQuery extends CommonPageAndList {
    @ApiProperty({ description: 'For search data keywords' })  
    @IsOptional()
    name?: string

    @ApiProperty({ description: 'For search data keywords' }) 
    @IsOptional() 
    type?: string
}


