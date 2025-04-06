import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { InvoiceService } from './invoice.service'
import { AuthGuard } from '../auth/AuthGuard'
import { CreateInvoiceDto, DashboardReqDto, InvoiceListRequestDto } from './invoice.dto'
import { InvoiceQueryService } from './invoice-query.service'

@Controller('invoice')
export class InvoiceController {
    constructor(
        private invoiceService: InvoiceService,
        private invoiceQueryService: InvoiceQueryService
    ) {}

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

    @Post('query/data-group-by')
    @UseGuards(AuthGuard)
    async getByDeptAndQty(@Body() query: DashboardReqDto) {
        return await this.invoiceQueryService.getByDataType(query)
    }
}