import { Body, Controller, Delete, Get, Move, Param, Post, UseGuards } from '@nestjs/common'
import { ProductService } from './product.service'
import { AuthGuard } from '../auth/AuthGuard'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ReturnMsg } from '../../tool/open-api-body'
import { CreateProductDto, ListProductRequestDto, StockInOutProductLocationDto, StockMoveProductLocationDto, UpdateProductDto } from './product.dto'
import { ProductLocationService } from './productLocation.service'

@Controller('product/product-list')
export class ProductController {
    constructor(
        private productService: ProductService,
        private productLocationService: ProductLocationService
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
        return this.productService.listPageRole(req)
    }

    @Post('batch-create')
    @UseGuards(AuthGuard)
    async importData(@Body() createDatas: CreateProductDto[]) {
        return await this.productService.importData(createDatas)
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
}