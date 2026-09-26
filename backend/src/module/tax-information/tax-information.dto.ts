import { IsOptional } from "@nestjs/class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { CommonPageAndList, CommonPageAndListResponse } from "src/tool/open-api-body"

export interface TaxInformationCreateDto {
    nationCode: string
    nationName: string
    countryCode: string
    countryName: string
    taxType: string
    taxCode: string
    taxName: string
    taxRate: number
    importRate: number
    remark: string
}

export interface UpdateDtoTaxInformation extends TaxInformationCreateDto{
    _id?: string
}

export interface TaxInformationListSearchDto {
    nameCode?: string,
    tax: string,
    page: number,
    limit: number
}

export interface TaxInformationImportDto {
    nationCode: string
    nationName: string
    countryCode: string
    countryName: string
    taxType: string
    taxCode: string
    taxName: string
    taxRate: number | string
    importRate: number | string
    remark: string
}

export interface TaxInfoForSalePoint {
    taxType: string
    countryCode: string
}

export class TaxInformationCreateBody {
    @ApiProperty({ description: 'Nation Code' })
    nationCode?: string

    @ApiProperty({ description: 'Nation Name' })
    nationName?: string

    @ApiProperty({ description: 'Country Code' })
    countryCode?: string

    @ApiProperty({ description: 'Country Name' })
    countryName?: string

    @ApiProperty({ description: 'Tax Type' })
    taxType?: string

    @ApiProperty({ description: 'Tax Code' })
    taxCode?: string

    @ApiProperty({ description: 'Tax Name' })
    taxName?: string

    @ApiProperty({ description: 'Tax Rate' })
    taxRate?: number

    @ApiProperty({ description: 'Import Rate' })
    importRate?: number

    @ApiProperty({ description: 'Remark' })
    @IsOptional()
    remark?: string
}

export class TaxInformationUpdateBody extends TaxInformationCreateBody {
    @ApiProperty({ description: 'Data Id' })
    _id!: string
}

export class TaxInformationBody extends TaxInformationUpdateBody {
    @ApiProperty({ description: 'Created At' })
    createdAt!: string

    @ApiProperty({ description: 'Updated At' })
    updatedAt?: string

    @ApiProperty({ description: '1 = Active, 0 = inactive' })  
    status!: number
}

export class TaxInformationListQuery extends CommonPageAndList {
    @ApiProperty({ description: 'For search data keywords' })  
    @IsOptional()
    nameCode?: string

    @ApiProperty({ description: 'For search data keywords' })  
    @IsOptional()
    tax?: string
}

export class TaxInformationListQueryRes extends CommonPageAndListResponse {
    @ApiProperty({ type: TaxInformationBody, isArray: true, description: 'Data List' })
    lists?: TaxInformationBody[]
}

export class TaxInfoForSalePointBody {
    @ApiProperty({ description: 'Tax Type' }) 
    taxType?: string

    @ApiProperty({ description: 'Country Code' })
    countryCode?: string
}
