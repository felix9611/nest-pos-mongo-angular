import { IsOptional } from "@nestjs/class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { CommonPageAndList, CommonPageAndListResponse } from "src/tool/open-api-body"
import { LocationBody } from "../location/location.dto"
import { InvoiceBody } from "../invoice/invoice.dto"
import { MemberBody } from "../member/member-list/member-list.dto"
import { PureProductBody } from "../product/product.dto"

export interface CreateReturnInvoiceItemDto {
    returnInvoiceId: string
    productId: string
    qty: number
    price: number
    taxType: string
    taxCode: string
    taxRate: number
    taxAmount: number
}

export interface CreateReturnInvoiceDto {
    returnInvoiceNo: string
    returnReason: string
    returnLocationId: string
    returnDatail: string
    returnMethod: string
    processMethod: string
    refund: boolean
    refundAmount:  number
    refundMethod: string
    returnToVendor: boolean
    returnItems: CreateReturnInvoiceItemDto[]
}

export interface UpdateReturnInvoiceDto extends CreateReturnInvoiceDto {
    _id: string
}

export interface InvoiceListRequestDto {
    page: number
    limit: number
    caseNumber?: string
    invoiceNumber?: string
    dateRange?: string[]
}

export class CreateReturnInvoiceItemBody {
    @ApiProperty({ description: 'Return Invoice Id' })
    returnInvoiceId: string

    @ApiProperty({ description: 'Product Id' })
    productId: string

    @ApiProperty({ description: 'Quantity' })
    qty: number

    @ApiProperty({ description: 'Price' })
    price: number

    @ApiProperty({ description: 'Tax Type' })
    taxType: string

    @ApiProperty({ description: 'Tax Code' })
    taxCode: string

    @ApiProperty({ description: 'Tax Rate' })
    taxRate: number

    @ApiProperty({ description: 'Tax Amount' })
    taxAmount: number
}

export class CreateReturnInvoiceBody {
    @ApiProperty({ description: 'Return Invoice Number' })
    returnInvoiceNo: string

    @ApiProperty({ description: 'Return Reason' })
    returnReason: string

    @ApiProperty({ description: 'Return Location Id' })
    returnLocationId: string

    @ApiProperty({ description: 'Return Detail'})
    returnDatail: string

    @ApiProperty({ description: 'Return Method' })
    returnMethod: string

    @ApiProperty({ description: 'Process Method' })
    processMethod: string

    @ApiProperty({ description: 'Refund or not' })
    refund: boolean

    @ApiProperty({ description: 'Refund Amount' })
    refundAmount:  number

    @ApiProperty({ description: 'Refund Method' })
    refundMethod: string

    @ApiProperty({ description: 'Return To Vendor or not' })
    returnToVendor: boolean

    @ApiProperty({ description: 'Return Items', type: CreateReturnInvoiceItemBody, isArray: true })
    returnItems: CreateReturnInvoiceItemBody[]
}

export class MainReturnInvoiceBody {
    @ApiProperty({ description: 'Invoice Number' })  
    invoiceNumber: string

    @ApiProperty({ description: 'Return Date' })
    returnDate: string

    @ApiProperty({ description: 'Return Reason' })
    returnReason: string

    @ApiProperty({ description: 'Return Location Id' })
    returnLocationId: string

    @ApiProperty({ description: 'Return Case Number' })
    returnCaseNumber: string

    @ApiProperty({ description: 'Return Detail'})
    returnDatail: string

    @ApiProperty({ description: 'Return Method' })
    returnMethod: string

    @ApiProperty({ description: 'Process Method' })
    processMethod: string

    @ApiProperty({ description: 'Refund or not' })
    refund: boolean

    @ApiProperty({ description: 'Refund Amount' })
    refundAmount: number

    @ApiProperty({ description: 'Refund Method' })
    refundMethod: string

    @ApiProperty({ description: 'Return To Vendor or not' })
    returnToVendor: boolean

    @ApiProperty({ description: 'Id' })
    _id: string

    @ApiProperty({ description: 'Created At' })
    createdAt: string

    @ApiProperty({ description: 'Updated At' })
    updatedAt: string

    @ApiProperty({ description: '1 = Active, 0 = inactive' })  
    status: number
}

export class DetailReturnInvoiceItemBody {
    @ApiProperty({ description: 'Id' })
    _id: string

    @ApiProperty({ description: 'Return Main Data Id' })
    returnDataId: string
    
    @ApiProperty({ description: 'Return Invoice Id' })
    returnInvoiceId: string
    
    @ApiProperty({ description: 'Product Id' })
    productId: string
    
    @ApiProperty({ description: 'Quantity' })
    qty: number
    
    @ApiProperty({ description: 'Price' })
    price: number
    
    @ApiProperty({ description: 'Tax Type' })
    taxType: string
    
    @ApiProperty({ description: 'Tax Code' })
    taxCode: string
    
    @ApiProperty({ description: 'Tax Rate' })
    taxRate: number
    
    @ApiProperty({ description: 'Tax Amount' })
    taxAmount: number 

    @ApiProperty({ description: 'Created At' })
    createdAt: string

    @ApiProperty({ description: 'Updated At' })
    updatedAt: string

    @ApiProperty({ description: '1 = Active, 0 = inactive' })  
    status: number

    @ApiProperty({ description: 'Product Data', type: PureProductBody })
    product: PureProductBody
}

export class DetailReturnInvoiceBody extends MainReturnInvoiceBody {
    @ApiProperty({ description: 'Invoice Data', type: InvoiceBody })
    invoice: InvoiceBody

    @ApiProperty({ description: 'Member Data', type: MemberBody })
    member: MemberBody

    @ApiProperty({ description: 'Return Items', type: DetailReturnInvoiceItemBody })
    returnItems:DetailReturnInvoiceItemBody
}

export class ReturnInvoiceBody extends MainReturnInvoiceBody {
    @ApiProperty({ description: 'Location Data', type: LocationBody })
    location: LocationBody
}

export class ReturnInvoiceListResponseBody extends CommonPageAndListResponse {
    @ApiProperty({ description: 'Return Invoice Data', type: ReturnInvoiceBody, isArray: true })
    lists: ReturnInvoiceBody[]
}

export class ReturnInvoiceListRequestBody extends CommonPageAndList {
    @ApiProperty({ description: 'Case Number' })
    @IsOptional()
    caseNumber: string

    @ApiProperty({ description: 'Invoice Number' })
    @IsOptional()
    invoiceNumber: string

    @ApiProperty({ description: 'Date Range', isArray: true })
    @IsOptional()
    dateRange: string
}


