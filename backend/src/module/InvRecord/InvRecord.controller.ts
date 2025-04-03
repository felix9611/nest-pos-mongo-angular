import { Controller, Body, Post, UseGuards } from '@nestjs/common'
import { InvRecordService } from './InvRecord.service'
import { AuthGuard } from '../auth/AuthGuard'
import { ListInvRecordDto } from './InvRecord.dto'

@Controller('inv-record')
export class InvRecordController {
    constructor(
        private invRecordService: InvRecordService
    ) {}

    @Post('list')
    @UseGuards(AuthGuard)
    async create(@Body() dto: ListInvRecordDto) {
        return await this.invRecordService.listPage(dto)
    }
}