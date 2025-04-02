import { ApiProperty } from '@nestjs/swagger'
import { CommonPageAndList, CommonPageAndListResponse } from '../../tool/open-api-body'

export interface CreateProductDto {
    productCode: string
    productName: string
    itemCode: string
    brandCode: string
    brandName: string
    typeId: string
    deptId: string
    vendorId: string
    unit: string
    costPrice: number
    retailPrice: number
    description: string
    remark: string
    uploaProductFiles?: ProductFileDto[]
}

export interface UpdateProductDto extends CreateProductDto {
    _id: string
}

export interface ListProductRequestDto {
    page: number
    limit: number
    name?: string
    code?: string
    typeIds?: string[]
    deptIds?: string[]
    vendorIds?: string[]
}

export interface StockInOutProductLocationDto {
    productCode: string
    productId: string
    placeCode: string
    locationId: string
    qty: number
    totalPrice: number
    totalCost: number
}

export interface StockMoveProductLocationDto {
    productCode: string
    productId: string
    fromPlaceCode: string
    fromLocationId: string
    toPlaceCode: string
    toLocationId: string
    qty: number
    totalPrice: number
    totalCost: number
}

export interface ListProductLocationtRequestDto {
    page: number
    limit: number
    locatiionIds?: string[]
}

export interface ProductFileDto {
    _id?: string
    assetId?: string
    fileName: string
    fileType: string
    base64: string
}

