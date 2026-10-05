import { Controller, Body, Post, UseGuards } from '@nestjs/common'
import { InvRecordService } from './InvRecord.service'
import { AuthGuard } from '../auth/AuthGuard'
import { DashboardReqBody, DashboardReqDto, DashboardResBody, ListInvRecordDto, ListInvRecordReq, ListInvRecordRes } from './InvRecord.dto'
import { InvRecordQueryService } from './InvRecord-query.service'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'

@Controller('inventory-record')
export class InventoryRecordController {
    constructor(
        private invRecordService: InvRecordService,
        private invReordQueryService: InvRecordQueryService
    ) {}

    @ApiOperation({ summary: 'Page and List' })
    @ApiBody({ type: ListInvRecordReq })
    @ApiResponse({ description: 'Return', status: 201, type: ListInvRecordRes })
    @Post('list')
    @UseGuards(AuthGuard)
    async listPage(@Body() dto: ListInvRecordDto) {
        return await this.invRecordService.listPage(dto)
    }

    @ApiOperation({ summary: 'List with filter' })
    @ApiBody({ type: ListInvRecordReq })
    @ApiResponse({ description: 'Return', status: 201, type: ListInvRecordRes })
    @Post('filter/list')
    @UseGuards(AuthGuard)
    async listWithFilter(@Body() dto: ListInvRecordDto) {
        return await this.invRecordService.listWithFilter(dto)
    }

    @ApiOperation({ summary: 'For dashboard query' })
    @ApiBody({ type: DashboardReqBody })
    @ApiResponse({ description: 'Return', status: 201, type: DashboardResBody, isArray: true })
    @Post('query')
    @UseGuards(AuthGuard)
    async query(@Body() dto: DashboardReqDto) {
        return await this.invReordQueryService.getByDataType(dto)
    }
}