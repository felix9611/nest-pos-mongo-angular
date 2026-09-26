import { IsOptional } from "@nestjs/class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { CommonPageAndList, CommonPageAndListResponse } from "src/tool/open-api-body"

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

export class CreateVendorBody {
    @ApiProperty({ description: 'Vendor Code' })
    vendorCode!: string

    @ApiProperty({ description: 'Vendor Name' })
    vendorName!: string

    @ApiProperty({ description: 'Vendor Other Name' })
    vendorOtherName?: string

    @ApiProperty({ description: 'Type' })
    type!: string

    @ApiProperty({ description: 'Email Address' })
    email?: string

    @ApiProperty({ description: 'Phone Number' })
    phone!: string

    @ApiProperty({ description: 'Fax Number' })
    fax?: string

    @ApiProperty({ description: 'Contact Address' })
    address!: string

    @ApiProperty({ description: 'Contact Person Name' })
    contactPerson!: string

    @ApiProperty({ description: 'Remark' })
    remark?: string
}

export class UpdateVendorBody extends CreateVendorBody {
    @ApiProperty({ description: 'Data Id' })
    _id!: string
}

export class VendorBody extends UpdateVendorBody {

    @ApiProperty({ description: 'Created At' })
    createdAt!: string

    @ApiProperty({ description: 'Updated At' })
    updatedAt?: string

    @ApiProperty({ description: '1 = Active, 0 = inactive' })  
    status!: number
}

export class ListVendorQuery extends CommonPageAndList {
    @ApiProperty({ description: 'For search data keywords' })  
    @IsOptional()
    name?: string

    @ApiProperty({ description: 'For search data keywords' })  
    @IsOptional()
    place?: string

    @ApiProperty({ description: 'For search data keywords' })  
    @IsOptional()
    contact?: string
}

export class ListVendorQueryRes extends CommonPageAndListResponse {
    @ApiProperty({ type: VendorBody, isArray: true, description: 'Data List' })
    lists?: VendorBody[]
}
