import { Controller, Body, Post, UseGuards } from '@nestjs/common'
import { InvRecordService } from './InvRecord.service'
import { AuthGuard } from '../auth/AuthGuard'
import { DashboardReqDto, ListInvRecordDto } from './InvRecord.dto'
import { InvRecordQueryService } from './InvRecord-query.service'

@Controller('inventory-record')
export class InventoryRecordController {
    constructor(
        private invRecordService: InvRecordService,
        private invReordQueryService: InvRecordQueryService
    ) {}

    @Post('list')
    @UseGuards(AuthGuard)
    async create(@Body() dto: ListInvRecordDto) {
        return await this.invRecordService.listPage(dto)
    }

    @Post('query')
    @UseGuards(AuthGuard)
    async query(@Body() dto: DashboardReqDto) {
        return await this.invReordQueryService.getByDataType(dto)
    }
}