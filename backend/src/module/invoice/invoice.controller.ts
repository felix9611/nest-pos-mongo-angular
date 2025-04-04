import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { InvoiceService } from './invoice.servicea'
import { AuthGuard } from '../auth/AuthGuard'
import { CreateInvoiceDto, InvoiceListRequestDto } from './invoice.dto'

@Controller('invoice')
export class InvoiceController {
    constructor(private invoiceService: InvoiceService) {}

    @Post('create')
    @UseGuards(AuthGuard)
    async create(@Body() createData: CreateInvoiceDto) {
        return await this.invoiceService.create(createData)
    }

    @Get('one/:id')
    @UseGuards(AuthGuard)
    async getOneById(@Param('id') id: string) {
        return await this.invoiceService.getOneById(id)
    }

    @Post('list')
    @UseGuards(AuthGuard)
    async listAndPage(@Body() req: InvoiceListRequestDto) {
        return this.invoiceService.listPage(req)
    }

    @Get('void/:id')
    @UseGuards(AuthGuard)
    async voidById(@Param('id') id: string) {
        return await this.invoiceService.invalidate(id)
    }
}