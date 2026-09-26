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
    page: number
    limit: number
}

export class ActionRecordBody {
    @ApiProperty({ description: 'Action Name' })
    actionName?: string | undefined

    @ApiProperty({ description: 'Action Method' })
    actionMethod?: string | undefined

    @ApiProperty({ description: 'Action From' })
    actionFrom?: string | undefined

    @ApiProperty({ description: 'Data in action', example: {} })
    actionData?: object | undefined

    @ApiProperty({ description: 'Success or not' })
    actionSuccess: string | undefined

    @ApiProperty({ description: 'Created At' })
    createdAt?: Date | undefined
}

export class ListActionRecordRes extends CommonPageAndListResponse {
    @ApiProperty({ type: [ActionRecordBody], description: 'Data List' })
    lists?: ActionRecordBody[] | undefined
}