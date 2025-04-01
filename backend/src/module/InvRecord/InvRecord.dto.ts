export interface InsertInvRecordDto {
    productId: string
    locFrom: string
    locTo: string
    qty: number
    cost: number
    staffId?: string
}