import { IsOptional } from "@nestjs/class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { LocationBody } from "../location/location.dto"
import { CommonPageAndList } from "src/tool/open-api-body"
import { PureProductBody } from "../product/product.dto"

export interface StockTakeForm {
    actionName: string
    actionPlaceId: string
    remark?: string
}

export interface UpdateStockTakeForm extends StockTakeForm {
    _id?: string
}

export interface ListStockTakeDto {
    page: number
    limit: number
    placeIds?: string[]
    name?: string
}

export interface StockTakeItemDto {
    _id?: string
    stockTakeId: string
    productId: string
    productCode: string
    placeId: string
    qty: number
    status: string
    checkTime: string
    remark?: string
}

export interface StockTakeItemDtoSubmit {
    stockTakeId: string
    productId: string
    productCode: string
    placeId: string
    qty: number
    status: string
    remark?: string
}

export class StockTakeItemDtoSubmitBody {
    @ApiProperty({ description: 'Stock Take Form Data Id' })
    stockTakeId!: string

    @ApiProperty({ description: 'Product Data Id' })
    productId!: string

    @ApiProperty({ description: 'Product Code' })
    productCode!: string

    @ApiProperty({ description: 'Location Data Id' })
    placeId!: string

    @ApiProperty({ description: 'Quantity' })
    qty!: number

    @ApiProperty({ description: 'Status' })
    status!: string

    @ApiProperty({ description: 'Remark', required: false })
    remark?: string
}

export class StockTakeItemBody {
    @ApiProperty({ description: 'Id' })
    _id!: string

    @ApiProperty({ description: 'Stock Take Form Data Id' })
    stockTakeId!: string
    
    @ApiProperty({ description: 'Product Data Id' })
    productId!: string 

    @ApiProperty({ description: 'Product Code' })
    productCode!: string

    @ApiProperty({ description: 'Location Data Id' })
    placeId!: string 

    @ApiProperty({ description: 'Quantity' })
    qty!: number

    @ApiProperty({ description: 'Status' })
    status!: string

    @ApiProperty({ description: 'Final Status' })
    finalStatus?: string

    @ApiProperty({ description: 'Check Time' })
    checkTime!: string

    @ApiProperty({ description: 'Remark' })
    remark?: string
}

export class StockTakeItemBodyWithProduct extends StockTakeItemBody {
    @ApiProperty({ description: 'Product Data', type: PureProductBody })
    product?: PureProductBody
}

export class UpdateStockTakeFormBody {
    @ApiProperty({ description: 'Id for update only' })
    _id!: string

    @ApiProperty({ description: 'Action Name' })
    actionName!: string

    @ApiProperty({ description: 'Action Place Id' })
    actionPlaceId!: string

    @ApiProperty({ description: 'Remark' })
    @IsOptional()
    remark?: string
}

export class StockTakeFormBody extends UpdateStockTakeFormBody {
    @ApiProperty({ description: 'Created Time' })
    createdTime!: string

    @ApiProperty({ description: 'Finish Time' })
    finishTime?: string

    @ApiProperty({ description: 'Status' })
    status!: number

    @ApiProperty({ description: 'Created By' })
    createBy?: string

    @ApiProperty({ description: 'Finish By' })
    finishBy?: string
}

export class DetailStockTakeFormBody extends StockTakeFormBody {
    @ApiProperty({ description: 'Stock Take Items', type: [StockTakeItemBodyWithProduct] })
    stockTakeItems?: StockTakeItemBodyWithProduct[]
}

export class StockTakeFormBodyWithLocation extends StockTakeFormBody {
    @ApiProperty({ description: 'Location Data', type: LocationBody })
    location?: LocationBody
}

export class StockTakeFormQuery extends CommonPageAndList {
    @ApiProperty({ description: 'For search data keywords' })  
    name?: string

    @ApiProperty({ description: 'For search data keywords', isArray: true })
    placeIds?: string
}

export class StockTakeListResponse extends CommonPageAndList {
    @ApiProperty({ type: [StockTakeFormBodyWithLocation], description: 'Data List' })
    lists?: StockTakeFormBodyWithLocation[]
}
