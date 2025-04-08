import { Body, Controller, Delete, Get, Move, Param, Post, UseGuards } from '@nestjs/common'
import { ProductService } from './product.service'
import { AuthGuard } from '../auth/AuthGuard'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ReturnMsg } from '../../tool/open-api-body'
import { CheckProductAndLocationDto, CreateProductDto, DashboardReqDto, ListProductLocationtRequestDto, ListProductRequestDto, StockInOutProductLocationDto, StockMoveProductLocationDto, UpdateProductDto } from './product.dto'
import { ProductLocationService } from './productLocation.service'
import { ProductLocationQueryService } from './productLocation-query.service'

@Controller('product/product-list')
export class ProductController {
    constructor(
        private productService: ProductService,
        private productLocationService: ProductLocationService,
        private productLocationQueryService: ProductLocationQueryService,
    ){}

    @Post('create')
    @UseGuards(AuthGuard)
    async create(@Body() createData: UpdateProductDto) {
        return await this.productService.create(createData)
    }
   
    @Post('update')
    @UseGuards(AuthGuard)
    async update(@Body() updateDto: UpdateProductDto) {
        return await this.productService.update(updateDto)
    }

    @Get('one/:id')
    @UseGuards(AuthGuard)
    async getOneById(@Param('id') id: string) {
        return await this.productService.getOneById(id)
    }

    @Get('code/:code')
    @UseGuards(AuthGuard)
    async getOneByCode(@Param('code') code: string) {
        return await this.productService.getOneByCode(code)
    }

    @Get('remove/:id')
    @UseGuards(AuthGuard)
    async removeById(@Param('id') id: string) {
        return await this.productService.invalidate(id)
    }

    @Get('getAll')
    @UseGuards(AuthGuard)
    async getAll() {
        return this.productService.findAll()
    }

    @Post('list')
    @UseGuards(AuthGuard)
    async listAndPage(@Body() req: ListProductRequestDto) {
        return this.productService.listPage(req)
    }

    @Post('batch-create')
    @UseGuards(AuthGuard)
    async importData(@Body() createDatas: CreateProductDto[]) {
        return await this.productService.importData(createDatas)
    }

    @Post('stock-out')
    @UseGuards(AuthGuard)
    async stockOut(@Body() data: StockInOutProductLocationDto) {
        return await this.productLocationService.stockOut(data)
    }

    @Post('stock-in')
    @UseGuards(AuthGuard)
    async stockIn(@Body() data: StockInOutProductLocationDto) {
        return await this.productLocationService.stockIn(data)
    }

    @Post('stock-move')
    @UseGuards(AuthGuard)
    async stockMove(@Body() data: StockMoveProductLocationDto) {
        return await this.productLocationService.stockMove(data)
    }

    @Post('location-list')
    @UseGuards(AuthGuard)
    async locationList(@Body() data: ListProductLocationtRequestDto) {
        return await this.productLocationService.listPage(data)
    }

    @Get('file-remove/:id')
    @UseGuards(AuthGuard)
    async removeFile(@Param('id') id: string) {
        return await this.productService.voidFileById(id)
    }

    @Post('query/data-group-by')
    @UseGuards(AuthGuard)
    async getByDeptAndQty(@Body() query: DashboardReqDto) {
        return await this.productLocationQueryService.getByDataType(query)
    }

    @Post('location/check')
    @UseGuards(AuthGuard)
    async checkProductAndLocationDto(@Body() data: CheckProductAndLocationDto) {
        return await this.productLocationService.checkProductAndLocationDto(data)
    }
}