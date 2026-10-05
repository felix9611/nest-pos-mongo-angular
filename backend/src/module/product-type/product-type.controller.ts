import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common'
import { ProductTypeService } from './product-type.service'
import { AuthGuard } from '../auth/AuthGuard'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ReturnMsg } from '../../tool/open-api-body'
import { CreateProductTypeBody, CreateproductTypeModelDto, ImportProductTypeBody, ListproductTypeModelRequestDto, ListProductTypeQueryRes, ProductTypeBody, ProductTypeQuery, UpdateProductTypeBody, UpdateproductTypeModelDto } from './product-type.dto'

@Controller('product/product-type')
export class ProductTypeController {
    constructor(private productTypeService: ProductTypeService){}

    @ApiOperation({ summary: 'Create Product Type' })
    @ApiBody({ description: 'Create Product Type', type: CreateProductTypeBody })
    @ApiResponse({ description: 'If save successful', status: 201, type: ProductTypeBody  })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('create')
    @UseGuards(AuthGuard)
    async create(@Body() createData: UpdateproductTypeModelDto) {
        return await this.productTypeService.create(createData)
    }
   
    @ApiOperation({ summary: 'Update Product Type' })
    @ApiBody({ type: UpdateProductTypeBody })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('update')
    @UseGuards(AuthGuard)
    async update(@Body() updateDto: UpdateproductTypeModelDto) {
        return await this.productTypeService.update(updateDto)
    }

    @ApiOperation({ summary: 'Get one data by id'})
    @ApiResponse({ description: 'If successful', status: 201, type: ProductTypeBody })
    @ApiResponse({ description: 'If not successful', status: 200, type: ReturnMsg })
    @Get('one/:id')
    @UseGuards(AuthGuard)
    async getOneById(@Param('id') id: string) {
        return await this.productTypeService.getOneById(id)
    }

    @ApiOperation({ summary: 'Void data by Id'})
    @ApiResponse({ description: 'Return message only', status: 200, type: ReturnMsg })
    @Get('remove/:id')
    @UseGuards(AuthGuard)
    async removeById(@Param('id') id: string) {
        return await this.productTypeService.invalidate(id)
    }

    @ApiOperation({ summary: 'Get all data'})
    @ApiResponse({ description: 'If successful', status: 201, type: ProductTypeBody, isArray: true })
    @Get('getAll')
    @UseGuards(AuthGuard)
    async getAll() {
        return this.productTypeService.findAll()
    }

    @ApiOperation({ summary: 'Page and list'})
    @ApiBody({ type: ProductTypeQuery })
    @ApiResponse({ description: 'If successful', status: 201, type: ListProductTypeQueryRes })
    @Post('list')
    @UseGuards(AuthGuard)
    async listAndPage(@Body() req: ListproductTypeModelRequestDto) {
        return this.productTypeService.listPage(req)
    }

    @ApiOperation({ summary: 'List with filters'})
    @ApiResponse({ description: 'If successful', status: 201, type: ProductTypeBody, isArray: true })
    @Post('filter/list')
    @UseGuards(AuthGuard)
    async listWithFilters(@Body() req: ListproductTypeModelRequestDto) {
        return this.productTypeService.listWithFilters(req)
    }

    @ApiOperation({ summary: 'Import List of Asset Type' })
    @ApiBody({ description: 'Create Asset Type', type: [ImportProductTypeBody] })
    @ApiResponse({ description: 'If save successful', status: 201, type: ProductTypeBody, isArray: true })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('batch-create')
    @UseGuards(AuthGuard)
    async importData(@Body() createDatas: CreateproductTypeModelDto[]) {
        return await this.productTypeService.importData(createDatas)
    }
}