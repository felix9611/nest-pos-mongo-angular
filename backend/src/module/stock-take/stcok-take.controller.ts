import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common'
import { StockTakeService } from './stock-take.service'
import { AuthGuard } from '../auth/AuthGuard'
import { ListStockTakeDto, StockTakeForm, StockTakeItemDto, StockTakeItemDtoSubmit, UpdateStockTakeForm } from './stock-take.dto'


@Controller('product/stock-take')
export class StockTakeController {
    constructor(
        private stockTakeService: StockTakeService
    ) {}

    @Get('one/:id')
    @UseGuards(AuthGuard)
    async getOneById(@Param('id') id: string) {
        return await this.stockTakeService.getOneStockTake(id)
    }

    @Post('create-form')
    @UseGuards(AuthGuard)
    async create(@Body() createBody: StockTakeForm, @Req() req: any) {
        return await this.stockTakeService.create(createBody, req.user.username)
    }

    @Post('update-form')
    @UseGuards(AuthGuard)
    async update(@Body() createBody: UpdateStockTakeForm) {
        return await this.stockTakeService.update(createBody)
    }

    @Get('void/:id')
    @UseGuards(AuthGuard)
    async voidById(@Param('id') id: string) {
        return await this.stockTakeService.finishOrVoid(id, 0)
    }

    @Get('finish/:id')
    @UseGuards(AuthGuard)
    async finishById(@Param('id') id: string, @Req() req: any) {
        return await this.stockTakeService.finishOrVoid(id, 2, req.user.username)
    }

    @Post('list')
    @UseGuards(AuthGuard)
    async listStockTakeForm(@Body() query: ListStockTakeDto) {
        return await this.stockTakeService.listStockTakeForm(query)
    }

    @Post('item-submit')
    @UseGuards(AuthGuard)
    async stockTakeItemSubmit(@Body() data: StockTakeItemDtoSubmit) {
        return await this.stockTakeService.stockTakeItemSubmit(data)
    }
}