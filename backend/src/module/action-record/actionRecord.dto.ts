import { ApiProperty } from '@nestjs/swagger'
import { CommonPageAndListResponse } from '../../tool/open-api-body'

export interface ActionRecordCreateDto {
    actionName: string
    actionMethod: string
    actionFrom: string
    actionData: any
    actionSuccess: string
    createdAt: Date
}

export interface ActionRecordListDto {
    page: number,
    limit: number
}

export class ActionRecordBody {
    @ApiProperty({ description: 'Action Name' })
    actionName: string

    @ApiProperty({ description: 'Action Method' })
    actionMethod: string

    @ApiProperty({ description: 'Action From' })
    actionFrom: string

    @ApiProperty({ description: 'Data in action', example: {} })
    actionData: object

    @ApiProperty({ description: 'Success or not' })
    actionSuccess: string

    @ApiProperty({ description: 'Created At' })
    createdAt: Date
}

export class ListActionRecordRes extends CommonPageAndListResponse {
    @ApiProperty({ type: [ActionRecordBody], description: 'Data List' })
    lists: ActionRecordBody[]
}