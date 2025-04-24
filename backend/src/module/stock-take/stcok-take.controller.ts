import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common'
import { StockTakeService } from './stock-take.service'
import { AuthGuard } from '../auth/AuthGuard'
import { DetailStockTakeFormBody, ListStockTakeDto, StockTakeForm, StockTakeFormBody, StockTakeFormQuery, StockTakeItemBody, StockTakeItemDto, StockTakeItemDtoSubmit, StockTakeItemDtoSubmitBody, StockTakeListResponse, UpdateStockTakeForm, UpdateStockTakeFormBody } from './stock-take.dto'
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger'
import { ReturnMsg } from 'src/tool/open-api-body'


@Controller('product/stock-take')
export class StockTakeController {
    constructor(
        private stockTakeService: StockTakeService
    ) {}

   
    @ApiOperation({ summary: 'Get detail by Id'})
    @ApiResponse({ description: 'Return successful', status: 200, type:  DetailStockTakeFormBody })
    @ApiResponse({ description: 'If not successful', status: 200, type: ReturnMsg })
    @Get('one/:id')
    @UseGuards(AuthGuard)
    async getOneById(@Param('id') id: string) {
        return await this.stockTakeService.getOneStockTake(id)
    }

    @ApiOperation({ summary: 'Create Stock Take Form' })
    @ApiBody({ description: 'Create Stock Take Form', type: UpdateStockTakeFormBody })
    @ApiResponse({ description: 'If save successful', status: 201, type: StockTakeFormBody  })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('create-form')
    @UseGuards(AuthGuard)
    async create(@Body() createBody: StockTakeForm, @Req() req: any) {
        return await this.stockTakeService.create(createBody, req.user.username)
    }

    @ApiOperation({ summary: 'Update Stock Take Form' })
    @ApiBody({ type: UpdateStockTakeFormBody })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('update-form')
    @UseGuards(AuthGuard)
    async update(@Body() createBody: UpdateStockTakeForm) {
        return await this.stockTakeService.update(createBody)
    }

    @ApiOperation({ summary: 'Void data by Id'})
    @ApiResponse({ description: 'Return message only', status: 200, type: ReturnMsg })
    @Get('void/:id')
    @UseGuards(AuthGuard)
    async voidById(@Param('id') id: string) {
        return await this.stockTakeService.finishOrVoid(id, 0)
    }

    @ApiOperation({ summary: 'Finish by Id'})
    @ApiResponse({ description: 'Return message only', status: 200, type: ReturnMsg })
    @Get('finish/:id')
    @UseGuards(AuthGuard)
    async finishById(@Param('id') id: string, @Req() req: any) {
        return await this.stockTakeService.finishOrVoid(id, 2, req.user.username)
    }

    @ApiOperation({ summary: 'Page and list'})
        @ApiBody({ type: StockTakeFormQuery })
        @ApiResponse({ description: 'If successful', status: 201, type: StockTakeListResponse })
    @Post('list')
    @UseGuards(AuthGuard)
    async listStockTakeForm(@Body() query: ListStockTakeDto) {
        return await this.stockTakeService.listStockTakeForm(query)
    }

    @ApiOperation({ summary: 'Stock Take Item Submit' })
    @ApiBody({ description: 'Stock Take Item Submit', type: StockTakeItemDtoSubmitBody })
    @ApiResponse({ description: 'Result', status: 201, type: StockTakeItemBody  })
    @Post('item-submit')
    @UseGuards(AuthGuard)
    async stockTakeItemSubmit(@Body() data: StockTakeItemDtoSubmit) {
        return await this.stockTakeService.stockTakeItemSubmit(data)
    }
}