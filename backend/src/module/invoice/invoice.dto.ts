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
    dataTypeValue?: 'dept' | 'type' | 'location' | 'none'
    valueField: 'counts' | 'costs'
    filter?: DashboardReqFilterDto
}

export interface FinalQuery {
    query: any
    productQuery: any
}
