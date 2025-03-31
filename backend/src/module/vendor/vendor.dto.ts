export interface CreateVendorDto {
    vendorCode: string
    vendorName: string
    vendorOtherName?: string
    type: string
    email?: string
    phone?: string
    fax?: string
    address: string
    contactPerson: string
    remark?: string
}

export interface UpdateVendorDto extends CreateVendorDto {
    _id?: string
}

export interface ListVendorRequestDto {
    page: number
    limit: number
    name?: string
    place?: string
    contact: string
}