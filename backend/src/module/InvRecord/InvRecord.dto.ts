import { ApiProperty } from "@nestjs/swagger"
import { PureProductBody } from "../product/product.dto"
import { LocationBody } from "../location/location.dto"
import { CommonPageAndList, CommonPageAndListResponse } from "src/tool/open-api-body"
import { IsOptional } from "@nestjs/class-validator"

export interface InsertInvRecordDto {
    productId: string
    locFrom: string
    locTo: string
    qty: number
    cost: number
    staffId?: string
}

export interface ListInvRecordDto {
    page: number
    limit: number,
    dateRange?: string[]
}

export interface DashboardReqDto {
    dataType: 'stockIn' | 'stockOut' | 'stockMove'
    filter: DashboardReqFilterDto
}

export interface DashboardReqFilterDto {
    dateRange?: string[]
    placeIds?: string[]
    productCode?: string
}

export class InvRecordRes {
    @ApiProperty({ description: 'Data Id' })
    _id: string

    @ApiProperty({ description: 'Product Id' })
    productId: string

    @ApiProperty({ description: 'Loc From Id' })
    locFrom: string

    @ApiProperty({ description: 'Loc To Id' })
    locTo: string

    @ApiProperty({ description: 'Quantity' })
    qty: number

    @ApiProperty({ description: 'Cost' })
    cost: number

    @ApiProperty({ description: 'Staff Id' })
    staffId: string

    @ApiProperty({ description: 'Created At' })
    createdAt: string

    @ApiProperty({ description: 'Product Data', type: PureProductBody })
    product: PureProductBody

    @ApiProperty({ description: 'Location From Data', type: LocationBody })
    locFromData: LocationBody

    @ApiProperty({ description: 'Location To Data', type: LocationBody })
    locToData: LocationBody
}

export class ListInvRecordRes extends CommonPageAndList {
    @ApiProperty({ type: InvRecordRes, isArray: true, description: 'Data List' })
    lists: InvRecordRes[]
}

export class ListInvRecordReq extends CommonPageAndListResponse {
    @ApiProperty({ description: 'Date Range', isArray: true })
    @IsOptional()
    dateRange: string[]
}

export class DashboardReqFilter {
    @ApiProperty({ description: 'Date Range', isArray: true })
    @IsOptional()
    dateRange: string[]

    @ApiProperty({ description: 'Location Id list', isArray: true })
    @IsOptional()
    placeIds: string[]

    @ApiProperty({ description: 'Product Code' })
    @IsOptional()
    productCode: string
}

export class DashboardReqBody {
    @ApiProperty({ description: 'Data Type, stockIn or stockOut or stockMove' })
    dataType: 'stockIn' | 'stockOut' | 'stockMove'

    @ApiProperty({ description: 'Filter', type: DashboardReqFilter })
    filter: DashboardReqFilter
}

export class DashboardResBody {
    @ApiProperty({ description: 'Year' })
    year: string

    @ApiProperty({ description: 'Month Name' })
    month: string

    @ApiProperty({ description: 'Month Number' })
    monthNum: number

    @ApiProperty({ description: 'Total Quantity' })
    qtys: number

    @ApiProperty({ description: 'Total Cost' })
    costs: number
}


