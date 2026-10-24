import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common'
import { StockTakeService } from './stock-take.service'
import { AuthGuard } from '../auth/AuthGuard'
import { DetailStockTakeFormBody, ListStockTakeDto, StockTakeForm, StockTakeFormBody, StockTakeFormQuery, StockTakeItemBody, StockTakeItemDto, StockTakeItemDtoSubmit, StockTakeItemDtoSubmitBody, StockTakeListResponse, UpdateStockTakeForm, UpdateStockTakeFormBody } from './stock-take.dto'
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger'
import { ReturnMsg } from 'src/tool/open-api-body'
import { JwtPayload } from '../auth/auth.dto'


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
    async getOneById(@Param('id') id: string, @Req() { user }: { user: JwtPayload }) {
        const data = await this.stockTakeService.getOneStockTake(id)
        if (user.superAdmin === true) {
            return data
        } else {
            if (!data.actionPlaceId || !user.placeIds.includes(data.actionPlaceId)) {
                throw new HttpException({ message: 'Location access denied' }, HttpStatus.FORBIDDEN)
            } else {
                return data
            }
        }
    }

    @ApiOperation({ summary: 'Create Stock Take Form' })
    @ApiBody({ description: 'Create Stock Take Form', type: UpdateStockTakeFormBody })
    @ApiResponse({ description: 'If save successful', status: 201, type: StockTakeFormBody  })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('create-form')
    @UseGuards(AuthGuard)
    async create(@Body() createBody: StockTakeForm, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin == false) {
            if (!user.placeIds.includes(createBody.actionPlaceId)) {
                throw new HttpException({ message: 'Location access denied' }, HttpStatus.FORBIDDEN)
            } else {
                return await this.stockTakeService.create(createBody, user.username)
            }
        } else {
            return await this.stockTakeService.create(createBody, user.username)
        }
    }

    @ApiOperation({ summary: 'Update Stock Take Form' })
    @ApiBody({ type: UpdateStockTakeFormBody })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('update-form')
    @UseGuards(AuthGuard)
    async update(@Body() createBody: UpdateStockTakeForm, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin == false) {
            if (!user.placeIds.includes(createBody.actionPlaceId)) {
                throw new HttpException({ message: 'Location access denied' }, HttpStatus.FORBIDDEN)
            } else {
                return await this.stockTakeService.update(createBody)
            }
        } else {
            return await this.stockTakeService.update(createBody)
        } 
    }

    @ApiOperation({ summary: 'Void data by Id'})
    @ApiResponse({ description: 'Return message only', status: 200, type: ReturnMsg })
    @Get('void/:id')
    @UseGuards(AuthGuard)
    async voidById(@Param('id') id: string, @Req() { user }: { user: JwtPayload }) {
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
    async listStockTakeForm(@Body() query: ListStockTakeDto, @Req() { user }: { user: JwtPayload }) {
         if (user.superAdmin === true) {
            return await this.stockTakeService.listStockTakeForm(query)
        } else {
            if ((query.placeIds ?? []).some(locationId => !user.placeIds.includes(locationId))) {
                throw new HttpException({ message: 'Location access denied' }, HttpStatus.FORBIDDEN)
            } else {
                return await this.stockTakeService.listStockTakeForm(query)
            }
        }
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