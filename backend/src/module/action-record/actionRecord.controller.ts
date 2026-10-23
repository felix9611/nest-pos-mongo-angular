import { Body, Controller, HttpException, HttpStatus, Post, Req } from '@nestjs/common'
import { ActionRecordService } from './actionRecord.service'
import { ActionRecordListDto, ListActionRecordRes  } from './actionRecord.dto'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { CommonPageAndList } from '../../tool/open-api-body'
import { JwtPayload } from '../auth/auth.dto'

@Controller('action-records')
export class ActionRecordController {
    constructor(private actionRecordService: ActionRecordService) {}

    @ApiOperation({ summary: 'Page and list'})
    @ApiBody({ type: CommonPageAndList })
    @ApiResponse({ status: 201, type: ListActionRecordRes })
    @Post('list')
    async list(@Body() query: ActionRecordListDto, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return await this.actionRecordService.listAndPage(query)
        } else {
            throw new HttpException({message: 'Access denied'}, HttpStatus.FORBIDDEN)
        }
    }
}