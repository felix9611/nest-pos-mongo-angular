import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { InvoiceService } from './invoice.service'
import { AuthGuard } from '../auth/AuthGuard'
import { CreateInvoiceBody, CreateInvoiceDto, DashboardReqDto, DetailInvoiceBody, InvoiceBody, InvoiceListRequestDto, InvoiceQueryReq, InvoiceQueryRes, ListInvoiceQueryReq, ListInvoiceQueryRes } from './invoice.dto'
import { InvoiceQueryService } from './invoice-query.service'
import { ReturnMsg } from 'src/tool/open-api-body'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'

@Controller('invoice')
export class InvoiceController {
    constructor(
        private invoiceService: InvoiceService,
        private invoiceQueryService: InvoiceQueryService
    ) {}

    @ApiOperation({ summary: 'Create Invoice' })
    @ApiBody({ type: CreateInvoiceBody })
    @ApiResponse({ description: 'If save successful', status: 201, type: InvoiceBody })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('create')
    @UseGuards(AuthGuard)
    async create(@Body() createData: CreateInvoiceDto) {
        return await this.invoiceService.create(createData)
    }

    @ApiOperation({ summary: 'Get Invoice by Id' })
    @ApiResponse({ description: 'If save successful', status: 201, type: DetailInvoiceBody })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Get('one/:id')
    @UseGuards(AuthGuard)
    async getOneById(@Param('id') id: string) {
        return await this.invoiceService.getOneById(id)
    }

    @ApiOperation({ summary: 'Get Invoice by No.' })
    @ApiResponse({ description: 'If save successful', status: 201, type: DetailInvoiceBody })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Get('number/:number')
    @UseGuards(AuthGuard)
    async getOneByNumber(@Param('number') number: string) {
        return await this.invoiceService.getOneByNumber(number)
    }

    @ApiOperation({ summary: 'List Invoice with filter' })
    @ApiBody({ type: ListInvoiceQueryReq })
    @ApiResponse({ description: 'Result', status: 201, type: ListInvoiceQueryRes })
    @Post('filter/list')
    @UseGuards(AuthGuard)
    async listWithFilter(@Body() req: InvoiceListRequestDto) {
        return this.invoiceService.listWithFilter(req)
    }

    @ApiOperation({ summary: 'List Invoice' })
    @ApiBody({ type: ListInvoiceQueryReq })
    @ApiResponse({ description: 'Result', status: 201, type: ListInvoiceQueryRes })
    @Post('list')
    @UseGuards(AuthGuard)
    async listAndPage(@Body() req: InvoiceListRequestDto) {
        return this.invoiceService.listPage(req)
    }

    @ApiOperation({ summary: 'Void One by Id' })
    @ApiResponse({  description: 'Return message only', status: 200, type: ReturnMsg })
    @Get('void/:id')
    @UseGuards(AuthGuard)
    async voidById(@Param('id') id: string) {
        return await this.invoiceService.invalidate(id)
    }

    @ApiOperation({ summary: 'Invoice Chart Query' })
    @ApiBody({ type: InvoiceQueryReq })
    @ApiResponse({ description: 'Result', status: 201, type: InvoiceQueryRes, isArray: true })
    @Post('query/data-group-by')
    @UseGuards(AuthGuard)
    async getByDeptAndQty(@Body() query: DashboardReqDto) {
        return await this.invoiceQueryService.getByDataType(query)
    }
}