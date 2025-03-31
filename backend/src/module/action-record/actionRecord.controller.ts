import { Body, Controller, Post } from '@nestjs/common'
import { ActionRecordService } from './actionRecord.service'
import { ActionRecordListDto, ListActionRecordRes  } from './actionRecord.dto'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { CommonPageAndList } from '../../tool/open-api-body'

@Controller('action-records')
export class ActionRecordController {
    constructor(private actionRecordService: ActionRecordService) {}

    @ApiOperation({ summary: 'Page and list'})
    @ApiBody({ type: CommonPageAndList })
    @ApiResponse({ status: 201, type: ListActionRecordRes })
    @Post('list')
    async list(@Body() query: ActionRecordListDto) {
        return await this.actionRecordService.listAndPage(query)
    }
}