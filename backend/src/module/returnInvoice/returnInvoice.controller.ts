import { Body, Controller, Delete, Get, Move, Param, Post, UseGuards } from '@nestjs/common'
import { ReturnInvoiceService } from './returnInvoice.service'
import { CreateReturnInvoiceBody, DetailReturnInvoiceBody, InvoiceListRequestDto, MainReturnInvoiceBody, ReturnInvoiceListRequestBody, ReturnInvoiceListResponseBody, UpdateReturnInvoiceDto } from './returnInvoice.dto'
import { AuthGuard } from '../auth/AuthGuard'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ReturnMsg } from 'src/tool/open-api-body'

@Controller('return-invoice')
export class ReturnInvoiceController {
    constructor(
        private returnInvoiceService: ReturnInvoiceService,
    ) {}

    @ApiOperation({ summary: 'Create' })
    @ApiBody({ type: CreateReturnInvoiceBody })
    @ApiResponse({ description: 'If save successful', status: 201, type: MainReturnInvoiceBody })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('create')
    @UseGuards(AuthGuard)
    async create(@Body() createData: UpdateReturnInvoiceDto) {
        return await this.returnInvoiceService.create(createData)
    }

    @ApiOperation({ summary: 'Get one detail by Id' })
    @ApiResponse({ description: 'If successful', status: 201, type: DetailReturnInvoiceBody })
    @ApiResponse({ description: 'If not successful', status: 200, type: ReturnMsg })
    @Get('one/:id')
    @UseGuards(AuthGuard)
    async getOneById(@Param('id') id: string) {
        return await this.returnInvoiceService.getOneById(id)
    }

    @ApiOperation({ summary: 'List with filter' })
    @ApiBody({ type: ReturnInvoiceListRequestBody })
    @ApiResponse({ description: 'If successful', status: 201, type: ReturnInvoiceListResponseBody })
    @Post('filter/list')
    @UseGuards(AuthGuard)
    async listWithFilter(@Body() req: InvoiceListRequestDto) {
        return this.returnInvoiceService.listWithFilter(req)
    }

    @ApiOperation({ summary: 'Page and list' })
    @ApiBody({ type: ReturnInvoiceListRequestBody })
    @ApiResponse({ description: 'If successful', status: 201, type: ReturnInvoiceListResponseBody })
    @Post('list')
    @UseGuards(AuthGuard)
    async listAndPage(@Body() req: InvoiceListRequestDto) {
        return this.returnInvoiceService.listPage(req)
    }
}