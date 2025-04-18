import { Body, Controller, Delete, Get, Move, Param, Post, UseGuards } from '@nestjs/common'
import { ReturnInvoiceService } from './returnInvoice.service'
import { InvoiceListRequestDto, UpdateReturnInvoiceDto } from './returnInvoice.dto'
import { AuthGuard } from '../auth/AuthGuard'

@Controller('return-invoice')
export class ReturnInvoiceController {
    constructor(
        private returnInvoiceService: ReturnInvoiceService,
    ) {}

    @Post('create')
    @UseGuards(AuthGuard)
    async create(@Body() createData: UpdateReturnInvoiceDto) {
        return await this.returnInvoiceService.create(createData)
    }

    @Get('one/:id')
    @UseGuards(AuthGuard)
    async getOneById(@Param('id') id: string) {
        return await this.returnInvoiceService.getOneById(id)
    }

    @Post('list')
    @UseGuards(AuthGuard)
    async listAndPage(@Body() req: InvoiceListRequestDto) {
        return this.returnInvoiceService.listPage(req)
    }
}