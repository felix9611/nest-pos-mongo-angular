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