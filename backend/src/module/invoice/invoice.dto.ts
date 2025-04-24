import { ApiProperty } from "@nestjs/swagger"
import { LocationBody } from "../location/location.dto"
import { MemberBody } from "../member/member-list/member-list.dto"
import { PureProductBody } from "../product/product.dto"
import { CommonPageAndList, CommonPageAndListResponse } from "src/tool/open-api-body"
import { IsOptional } from "@nestjs/class-validator"

export interface InvoiceItemDto {
    productId: string
    productCode: string
    qty: number
    price: number
    discount: number
    discountType: string
    taxType: string
    taxCode: string
    taxRate: number
    taxAmount: number 
}

export interface InvoicePaymentDto {
    method: string
    amount: number
    paymentTime: string
}

export interface CreateInvoiceDto {
    memberId: string
    locationId: string
    locationCode: string
    totalAmount: number
    discount: number
    discountType: string
    taxTotal: number
    remark: string
    invoiceItems: InvoiceItemDto[]
    invoicePayments: InvoicePaymentDto[]
}

export interface InvoiceListRequestDto {
    page: number
    limit: number
    number?: string
    dateRange?: string[]
}


export interface DashboardReqFilterDto {
    productCode?: string
    productName?: string
    typeIds?: string[]
    placeIds?: string[]
    deptIds?: string[]
    salesDateRange?: string[]
}

export interface DashboardReqDto {
    dateType?: boolean
    dateTypeValue?: 'YearMonth' | 'YearQuarter' | 'none'
    dataType?: boolean
    dataTypeValue?: 'dept' | 'type' | 'location' | 'year-month' |'none'
    valueField?: 'qtys' | 'price'
    filter: DashboardReqFilterDto
}

export interface FinalQuery {
    query: any
    productQuery?: any
}

export class CreateInvoiceItemBody {
    @ApiProperty({ description: 'Product Id' })
    productId: string

    @ApiProperty({ description: 'Product Code' })
    productCode: string

    @ApiProperty({ description: 'Quantity' })
    qty: number

    @ApiProperty({ description: 'Price' })
    price: number

    @ApiProperty({ description: 'Discount' })
    discount: number

    @ApiProperty({ description: 'Discount Type, $ or %' })
    discountType: string

    @ApiProperty({ description: 'Tax Type' })
    taxType: string

    @ApiProperty({ description: 'Tax Code' })
    taxCode: string

    @ApiProperty({ description: 'Tax Rate' })
    taxRate: number

    @ApiProperty({ description: 'Tax Amount' })
    taxAmount: number 
}

export class InvoiceItemBody extends CreateInvoiceItemBody {
    @ApiProperty({ description: 'Data Id' })
    _id: string

    @ApiProperty({ description: 'Invoice data Id' })
    invoiceId: string

    @ApiProperty({ description: 'Created At' })
    createdAt: string

    @ApiProperty({ description: 'Updated At' })
    updatedAt: string

    @ApiProperty({ description: '1 = Active, 0 = inactive' })  
    status: number
}

export class FullInvoiceItemBody extends InvoiceItemBody {
    @ApiProperty({ description: 'Product Data', type: PureProductBody })
    product: PureProductBody
}


export class CreateInvoicePaymentBody {
    @ApiProperty({ description: 'Payment Method' })
    method: string

    @ApiProperty({ description: 'Payment Amount' })
    amount: number

    @ApiProperty({ description: 'Payment Time' })
    paymentTime: string
}

export class InvoicePaymentBody extends CreateInvoicePaymentBody {
    @ApiProperty({ description: 'Data Id' })
    _id: string

    @ApiProperty({ description: 'Invoice data Id' })
    invoiceId: string

    @ApiProperty({ description: 'Created At' })
    createdAt: string

    @ApiProperty({ description: 'Updated At' })
    updatedAt: string

    @ApiProperty({ description: '1 = Active, 0 = inactive' })  
    status: number
}

export class MainInvoiceBody {
    @ApiProperty({ description: 'Member Id' })
    memberId: string

    @ApiProperty({ description: 'Location Id' })
    locationId: string

    @ApiProperty({ description: 'Location Code' })
    locationCode: string

    @ApiProperty({ description: 'Total Amount' })
    totalAmount: number

    @ApiProperty({ description: 'Discount' })
    discount: number

    @ApiProperty({ description: 'Discount Type, $ or %' })
    discountType: string

    @ApiProperty({ description: 'Tax Total' })
    taxTotal: number

    @ApiProperty({ description: 'Remark' })
    remark: string
}

export class CreateInvoiceBody extends MainInvoiceBody {

    @ApiProperty({ type: CreateInvoiceItemBody, isArray: true, description: 'Invoice Items' })
    invoiceItems: CreateInvoiceItemBody[]

    @ApiProperty({ type: CreateInvoicePaymentBody, isArray: true, description: 'Invoice Payments' })
    invoicePayments: CreateInvoicePaymentBody[]
}

export class InvoiceBody extends MainInvoiceBody {
    @ApiProperty({ description: 'Invoice data Id' })
    _id: string

    @ApiProperty({ description: 'Invoice Number' })
    number: string

    @ApiProperty({ type: InvoiceItemBody, isArray: true, description: 'Invoice Items' })
    invoiceItems: InvoiceItemBody[]

    @ApiProperty({ type: InvoicePaymentBody, isArray: true, description: 'Invoice Payments' })
    invoicePayments: InvoicePaymentBody[]

    @ApiProperty({ description: 'Created At' })
    createdAt: string

    @ApiProperty({ description: 'Updated At' })
    updatedAt: string

    @ApiProperty({ description: '1 = Active, 0 = inactive' })  
    status: number
}


export class DetailInvoiceBody extends MainInvoiceBody {
    @ApiProperty({ description: 'Invoice data Id' })
    _id: string

    @ApiProperty({ description: 'Invoice Number' })
    number: string

    @ApiProperty({ type: FullInvoiceItemBody, isArray: true, description: 'Invoice Items' })
    invoiceItems: FullInvoiceItemBody[]

    @ApiProperty({ type: InvoicePaymentBody, isArray: true, description: 'Invoice Payments' })
    invoicePayments: InvoicePaymentBody[]

    @ApiProperty({ description: 'Member Data', type: MemberBody })
    member: MemberBody
    
    @ApiProperty({ description: 'Location Data', type: LocationBody })
    location: LocationBody

    @ApiProperty({ description: 'Created At' })
    createdAt: string

    @ApiProperty({ description: 'Updated At' })
    updatedAt: string

    @ApiProperty({ description: '1 = Active, 0 = inactive' })  
    status: number
}


export class PureDetailInvoiceBody extends MainInvoiceBody {
    @ApiProperty({ description: 'Invoice data Id' })
    _id: string

    @ApiProperty({ description: 'Invoice Number' })
    number: string
    
    @ApiProperty({ description: 'Location Data', type: LocationBody })
    location: LocationBody

    @ApiProperty({ description: 'Created At' })
    createdAt: string

    @ApiProperty({ description: 'Updated At' })
    updatedAt: string

    @ApiProperty({ description: '1 = Active, 0 = inactive' })  
    status: number
}

export class ListInvoiceQueryReq extends CommonPageAndList {
    @ApiProperty({ description: 'Invoice Number' })
    @IsOptional()
    number: string

    @ApiProperty({ description: 'Date Range' })
    @IsOptional()
    dateRange: string
}

export class ListInvoiceQueryRes extends CommonPageAndListResponse {
    @ApiProperty({ type: PureDetailInvoiceBody, isArray: true, description: 'Data List' })
    lists: PureDetailInvoiceBody[]
}

export class InvoiceQueryFilter {
    
    @ApiProperty({ description: 'Type Ids', isArray: true })
    @IsOptional()
    typeIds: string[] 

    @ApiProperty({ description: 'Location Ids', isArray: true })
    @IsOptional()
    placeIds: string[] 

    @ApiProperty({ description: 'Department Ids', isArray: true })
    @IsOptional()
    deptIds: string[] 

    @ApiProperty({ description: 'Sales Date Range', isArray: true })
    @IsOptional()
    salesDateRange: string[]

    @ApiProperty({ description: 'Product Code' })
    @IsOptional()
    productCode: string 

    @ApiProperty({ description: 'Product Name' })
    @IsOptional()
    productName: string
}

export class InvoiceQueryReq {
    @ApiProperty({ type: InvoiceQueryFilter, description: 'Filter' })
    filter: InvoiceQueryFilter

    @ApiProperty({ description: 'Value Field, qtys or price' })
    valueField: string

    @ApiProperty({ description: 'Data Type, dept or type or location' })
    dataTypeValue: string
}

export class InvoiceQueryRes {
    @ApiProperty({ description: 'Department Name' })
    deptName: string

    @ApiProperty({ description: 'Type Name' })
    typeName: string

    @ApiProperty({ description: 'Year' })
    year: string

    @ApiProperty({ description: 'Month Name' })
    month: string

    @ApiProperty({ description: 'Month Number' })
    monthNum: number

    @ApiProperty({ description: 'Location Name' })
    placeName: string

    @ApiProperty({ description: 'Qtys' })
    qtys: number

    @ApiProperty({ description: 'Total Price' })
    price: number
}
