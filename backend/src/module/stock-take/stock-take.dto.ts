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