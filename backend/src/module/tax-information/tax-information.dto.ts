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