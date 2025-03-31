import { ApiProperty } from '@nestjs/swagger'
import { CommonPageAndList, CommonPageAndListResponse } from '../../tool/open-api-body'

export interface CreateCodeTypeDto {
    valueCode: string
    valueName: string,
    type: string
}

export interface UpdateCodeTypeDto extends CreateCodeTypeDto {
    _id?: string
}

export interface ListCodeTypeRequestDto {
    page: number
    limit: number
    name?: string
}

export class CreateCodeTypeBody {

    @ApiProperty({ description: 'Value Code' })
    valueCode: string

    @ApiProperty({ description: 'Value Name' })
    valueName: string

    @ApiProperty({ description: 'Type for catelog' })
    type: string
}

export class UpdateCodeTypeBody extends CreateCodeTypeBody {

    @ApiProperty({ description: 'Data Id' })
    _id: string
}

export class CodeTypeBody extends UpdateCodeTypeBody {

    @ApiProperty({ description: 'Created At' })
    createdAt: string

    @ApiProperty({ description: 'Updated At' })
    updatedAt: string

    @ApiProperty({ description: '1 = Active, 0 = inactive' })  
    status: number
}

export class ListCodeTypeQuery extends CommonPageAndList {
    @ApiProperty({ description: 'For search data keywords' })  
    name: string
}

export class ListCodeTypeQueryRes extends CommonPageAndListResponse {
    @ApiProperty({ type: [CodeTypeBody], description: 'Data List' })
    lists: CodeTypeBody[]
}