import { ApiProperty } from '@nestjs/swagger'
import { CommonPageAndList, CommonPageAndListResponse } from '../../tool/open-api-body'
import { AnyCnameRecord } from 'dns'
import { IsOptional } from '@nestjs/class-validator'
import { DepartmentBody } from '../department/department.dto'
import { ProductTypeBody } from '../product-type/product-type.dto'
import { LocationBody } from '../location/location.dto'
import { exec } from 'child_process'

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
    taxType: string
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
    locationIds?: string[]
    assetCode?: string
}

export interface ProductFileDto {
    _id?: string
    assetId?: string
    fileName: string
    fileType: string
    base64: string
}

export interface DashboardReqDto {
    dataTypeValue?: 'dept' | 'type' | 'location' | 'year-month' |'none'
   // valueField?: 'qtys' | 'price'
    filter: DashboardReqFilterDto
}

export interface DashboardReqFilterDto {
    productCode?: string
    productName?: string
    typeIds?: string[]
    placeIds?: string[]
    deptIds?: string[]
}

export interface CheckProductAndLocationDto {
    productId: string
    locationId: string
}


export class BaseProductBody {
    @ApiProperty({ description: 'Product Code' })
    @IsOptional()
    productCode!: string

    @ApiProperty({ description: 'Product Name' })
    productName!: string

    @ApiProperty({ description: 'Item Code' })
    itemCode!: string

    @ApiProperty({ description: 'Brand Code' })
    brandCode?: string

    @ApiProperty({ description: 'Brand Name' })
    brandName!: string

    @ApiProperty({ description: 'Type Data Id' })
    typeId!: string

    @ApiProperty({ description: 'Department Data Id' })
    deptId!: string

    @ApiProperty({ description: 'Vendor Data Id' })
    vendorId!: string

    @ApiProperty({ description: 'Unit' })
    unit!: string

    @ApiProperty({ description: 'Cost Price' })
    costPrice!: number

    @ApiProperty({ description: 'Retail Price' })
    retailPrice!: number

    @ApiProperty({ description: 'Description' })
    description?: string

    @ApiProperty({ description: 'Remark' })
    remark?: string

    @ApiProperty({ description: 'Tax Type' })
    taxType!: string
    
}

export class UploadProductFileBody {
    @ApiProperty({ description: 'File Name' })
    fileName!: string

    @ApiProperty({ description: 'File Type' })
    fileType!: string

    @ApiProperty({ description: 'Base64 data' })
    base64!: string
}

export class UpdateProductBody extends BaseProductBody  {
    @ApiProperty({ description: 'Product Files', type: UploadProductFileBody, isArray: true })
    uploaProductFiles?: UploadProductFileBody[]

    @ApiProperty({ description: 'Product Id' })
    _id!: string
}

export class PureProductBody extends BaseProductBody {
    @ApiProperty({ description: 'Product Id' })
    _id!: string

    @ApiProperty({ description: 'Created At' })
    createdAt!: string

    @ApiProperty({ description: 'Updated At' })
    updatedAt!: string

    @ApiProperty({ description: '1 = Active, 0 = inactive' })  
    status!: number
}

export class ProductFileBody extends UploadProductFileBody {
    @ApiProperty({ description: 'Product Id' })
    productId!: string

    @ApiProperty({ description: 'Created At' })
    createdAt!: string

    @ApiProperty({ description: 'Updated At' })
    updatedAt!: string

    @ApiProperty({ description: '1 = Active, 0 = inactive' })
    status!: number
}

export class ProductBodyWithFiles extends PureProductBody {
    @ApiProperty({ description: 'Created At', type: ProductFileBody, isArray: true })
    productFiles?: ProductFileBody[]
}

export class ListPageProductRequestBody extends CommonPageAndList {
    @ApiProperty({ description: 'Product Name for search' })
    name?: string
}

export class ListProductBody extends PureProductBody {
    @ApiProperty({ description: 'Department', type: DepartmentBody })
    department?: DepartmentBody

    @ApiProperty({ description: 'Type', type: ProductTypeBody })
    producttype?: ProductTypeBody
}

export class ListPageProductResponse extends CommonPageAndListResponse {
    @ApiProperty({ description: 'Lists Data', type: ListProductBody, isArray: true })
    lists?: ListProductBody[]
}

export class ListProductLocationBody {
    @ApiProperty({ description: 'Data Id' })
    _id!: string
       
    @ApiProperty({ description: 'Product Location Id' })
    productId!: string
    
    @ApiProperty({ description: 'Location Id' })
    locationId!: string
    
    @ApiProperty({ description: 'Quantity' })
    qty!: number
    
    @ApiProperty({ description: 'Total Price' })
    totalPrice!: number
    
    @ApiProperty({ description: 'Total Cost' })
    totalCost!: number
}

export class FullProductLocationBody extends ListProductLocationBody {
    @ApiProperty({ description: 'Product', type: PureProductBody, isArray: true })
    product?: PureProductBody

    @ApiProperty({ description: 'Location', type: LocationBody, isArray: true })
    location?: LocationBody
}

export class ListPageProductLocationRequest extends CommonPageAndList {
    @ApiProperty({ description: 'Product Ids', isArray: true })
    locationIds?: string[]

    @ApiProperty({ description: 'Asset Code' })
    assetCode?: string
} 

export class ListPageProductLocationResponse extends CommonPageAndListResponse {
    @ApiProperty({ description: 'Lists Data', type: FullProductLocationBody, isArray: true })
    lists?: FullProductLocationBody[]
}

export class CheckProductAndLocationRequestBody {
    @ApiProperty({ description: 'Product Id' })
    productId!: string

    @ApiProperty({ description: 'Location Id' })
    locationId!: string
}

export class CheckProductAndLocationResponseBody {
    @ApiProperty({ description: 'Found Status' })
    status!: boolean

    @ApiProperty({ description: 'Data if scucess', type: ListProductLocationBody })
    data?: ListProductLocationBody
}

export class StockInRequestBody {
    @ApiProperty({ description: 'Product Code' })
    productCode!: string

    @ApiProperty({ description: 'Product Id' })
    productId!: string

    @ApiProperty({ description: 'Location Code' })
    placeCode!: string

    @ApiProperty({ description: 'Location Id' })
    locationId!: string

    @ApiProperty({ description: 'Quantity' })
    qty!: number

    @ApiProperty({ description: 'Total Cost' })
    totalCost?: number 

    @ApiProperty({ description: 'Total Price' })
    totalPrice?: number
}

export class StockMoveRequestBody {
    @ApiProperty({ description: 'Product Code' })
    productCode!: string

    @ApiProperty({ description: 'Product Id' })
    productId!: string

    @ApiProperty({ description: 'Quantity' })
    qty!: number

    @ApiProperty({ description: 'From Location Code' })
    fromPlaceCode!: string 

    @ApiProperty({ description: 'From Location Id' })
    fromLocationId!: string

    @ApiProperty({ description: 'To Location Code' })
    toPlaceCode!: string

    @ApiProperty({ description: 'To Location Id' })
    toLocationId!: string

    @ApiProperty({ description: 'Total Cost' })
    totalCost!: number

    @ApiProperty({ description: 'Total Price' })
    totalPrice! : number
}

export class StockOutRequestBody {
    @ApiProperty({ description: 'Product Code' })
    productCode!: string

    @ApiProperty({ description: 'Product Id' })
    productId!: string

    @ApiProperty({ description: 'Location Code' })
    placeCode!: string 

    @ApiProperty({ description: 'Location Id' })
    locationId!: string 

    @ApiProperty({ description: 'Quantity' })
    qty!: number 

    @ApiProperty({ description: 'Total Cost' })
    totalCost!: number 

    @ApiProperty({ description: 'Total Price' })
    totalPrice!: number
}

export class DashboardReqFilter {
    @ApiProperty({ description: 'Product Code' })
    @IsOptional()
    productCode?: string

    @ApiProperty({ description: 'Product Name' })
    @IsOptional()
    productName?: string

    @ApiProperty({ description: 'Type Id', isArray: true })
    @IsOptional()
    typeIds?: string[]

    @ApiProperty({ description: 'Location Id', isArray: true })
    @IsOptional()
    placeIds?: string[]

    @ApiProperty({ description: 'Department Id', isArray: true })
    @IsOptional()
    deptIds?: string[]
}

export class GetByDeptAndQtyRequestBody {
    @ApiProperty({ description: 'Data Type Value, dept OR type OR location' })
    dataTypeValue!: 'dept' | 'type' | 'location'

    @ApiProperty({ description: 'Filters', type: DashboardReqFilter })
    filter?: DashboardReqFilter
}

export class ProductLocationQueryResponse {
    @ApiProperty({ description: 'Department Name' })
    deptName?: string

    @ApiProperty({ description: 'Location Name' })
    placeName?: string

    @ApiProperty({ description: 'Type Name' })
    typeName?: string

    @ApiProperty({ description: 'Total Quantitys' })
    totalQty?: number

    @ApiProperty({ description: 'Total Price' })
    totalPrice?: number

    @ApiProperty({ description: 'Total Cost' })
    totalCost?: number

}
