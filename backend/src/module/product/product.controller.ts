import { Body, Controller, Delete, Get, Move, Param, Post, UseGuards } from '@nestjs/common'
import { ProductService } from './product.service'
import { AuthGuard } from '../auth/AuthGuard'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ReturnMsg } from '../../tool/open-api-body'
import { BaseProductBody, CheckProductAndLocationDto, CheckProductAndLocationRequestBody, CheckProductAndLocationResponseBody, CreateProductDto, DashboardReqDto, GetByDeptAndQtyRequestBody, ListPageProductLocationRequest, ListPageProductLocationResponse, ListPageProductRequestBody, ListPageProductResponse, ListProductLocationtRequestDto, ListProductRequestDto, ProductBodyWithFiles, ProductLocationQueryResponse, PureProductBody, StockInOutProductLocationDto, StockInRequestBody, StockMoveProductLocationDto, StockMoveRequestBody, StockOutRequestBody, UpdateProductBody, UpdateProductDto } from './product.dto'
import { ProductLocationService } from './productLocation.service'
import { ProductLocationQueryService } from './productLocation-query.service'

@Controller('product/product-list')
export class ProductController {
    constructor(
        private productService: ProductService,
        private productLocationService: ProductLocationService,
        private productLocationQueryService: ProductLocationQueryService,
    ){}

    @ApiOperation({ summary: 'Create Product' })
    @ApiBody({ type: UpdateProductBody })
    @ApiResponse({ description: 'If save successful', status: 201, type: PureProductBody })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('create')
    @UseGuards(AuthGuard)
    async create(@Body() createData: UpdateProductDto) {
        return await this.productService.create(createData)
    }
   
    @ApiOperation({ summary: 'Update Product' })
    @ApiBody({ type: UpdateProductBody })
    @ApiResponse({ description: 'Return message only', status: 200, type: ReturnMsg })
    @Post('update')
    @UseGuards(AuthGuard)
    async update(@Body() updateDto: UpdateProductDto) {
        return await this.productService.update(updateDto)
    }

    @ApiOperation({ summary: 'Get one by id' })
    @ApiResponse({ description: 'If successful', status: 201, type: ProductBodyWithFiles })
    @ApiResponse({ description: 'If not successful', status: 200, type: ReturnMsg })
    @Get('one/:id')
    @UseGuards(AuthGuard)
    async getOneById(@Param('id') id: string) {
        return await this.productService.getOneById(id)
    }

    @ApiOperation({ summary: 'Get one by code' })
    @ApiResponse({ description: 'If successful', status: 201, type: PureProductBody })
    @ApiResponse({ description: 'If not successful', status: 200, type: ReturnMsg })
    @Get('code/:code')
    @UseGuards(AuthGuard)
    async getOneByCode(@Param('code') code: string) {
        return await this.productService.getOneByCode(code)
    }

    @ApiOperation({ summary: 'Void one by ID' })
    @ApiResponse({ description: 'Return message only', status: 200, type: ReturnMsg })
    @Get('remove/:id')
    @UseGuards(AuthGuard)
    async removeById(@Param('id') id: string) {
        return await this.productService.invalidate(id)
    }

    @ApiOperation({ summary: 'Get All Product' })
    @ApiResponse({ description: 'If successful', status: 201, type: PureProductBody })
    @Get('getAll')
    @UseGuards(AuthGuard)
    async getAll() {
        return this.productService.findAll()
    }

    @ApiOperation({ summary: 'List with filter' })
    @ApiBody({ type: ListPageProductRequestBody })
    @ApiResponse({ description: 'If successful', status: 201, type: ListPageProductResponse })
    @Post('filter/list')
    @UseGuards(AuthGuard)
    async listWithFilter(@Body() req: ListProductRequestDto) {
        return this.productService.listWithFilter(req)
    }

    @ApiOperation({ summary: 'Page and list for Product' })
    @ApiBody({ type: ListPageProductRequestBody })
    @ApiResponse({ description: 'If successful', status: 201, type: ListPageProductResponse })
    @Post('list')
    @UseGuards(AuthGuard)
    async listAndPage(@Body() req: ListProductRequestDto) {
        return this.productService.listPage(req)
    }

    @ApiOperation({ summary: 'Batch to Create Product' })
    @ApiBody({ type: BaseProductBody, isArray : true })
    @ApiResponse({ description: 'If save successful', status: 201, type: PureProductBody, isArray: true })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('batch-create')
    @UseGuards(AuthGuard)
    async importData(@Body() createDatas: CreateProductDto[]) {
        return await this.productService.importData(createDatas)
    }

    @ApiOperation({ summary: 'Stock Out' })
    @ApiBody({ type: StockOutRequestBody })
    @ApiResponse({ description: 'If successful', status: 201 })
    @Post('stock-out')
    @UseGuards(AuthGuard)
    async stockOut(@Body() data: StockInOutProductLocationDto) {
        return await this.productLocationService.stockOut(data)
    }

    @ApiOperation({ summary: 'Stock In' })
    @ApiBody({ type: StockInRequestBody })
    @ApiResponse({ description: 'If successful', status: 201 })
    @Post('stock-in')
    @UseGuards(AuthGuard)
    async stockIn(@Body() data: StockInOutProductLocationDto) {
        return await this.productLocationService.stockIn(data)
    }

    @ApiOperation({ summary: 'Stock Move' })
    @ApiBody({ type: StockMoveRequestBody })
    @ApiResponse({ description: 'If successful', status: 201 })
    @Post('stock-move')
    @UseGuards(AuthGuard)
    async stockMove(@Body() data: StockMoveProductLocationDto) {
        return await this.productLocationService.stockMove(data)
    }

    @ApiOperation({ summary: 'Page and list for Product Location' })
    @ApiBody({ type: ListPageProductLocationRequest })
    @ApiResponse({ description: 'If successful', status: 201, type: ListPageProductLocationResponse })
    @Post('location-list')
    @UseGuards(AuthGuard)
    async locationList(@Body() data: ListProductLocationtRequestDto) {
        return await this.productLocationService.listPage(data)
    }

    @ApiOperation({ summary: 'Remove one file by ID' })
    @ApiResponse({ description: 'Return message only', status: 200, type: ReturnMsg })
    @Get('file-remove/:id')
    @UseGuards(AuthGuard)
    async removeFile(@Param('id') id: string) {
        return await this.productService.voidFileById(id)
    }

    @ApiOperation({ summary: 'Query for dashboard datas' })
    @ApiBody({ type: GetByDeptAndQtyRequestBody })
    @ApiResponse({ description: 'If successful', status: 201, type: ProductLocationQueryResponse, isArray: true })
    @Post('query/data-group-by')
    @UseGuards(AuthGuard)
    async getByDeptAndQty(@Body() query: DashboardReqDto) {
        return await this.productLocationQueryService.getByDataType(query)
    }

    @ApiOperation({ summary: 'Search product and location data' })
    @ApiBody({ type: CheckProductAndLocationRequestBody })
    @ApiResponse({ description: 'Return body', status: 201, type: CheckProductAndLocationResponseBody  })
    @Post('location/check')
    @UseGuards(AuthGuard)
    async checkProductAndLocation(@Body() data: CheckProductAndLocationDto) {
        return await this.productLocationService.checkProductAndLocationDto(data)
    }
}