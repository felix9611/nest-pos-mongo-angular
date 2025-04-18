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
