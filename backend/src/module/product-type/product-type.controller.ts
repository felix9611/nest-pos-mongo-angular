import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common'
import { ProductTypeService } from './product-type.service'
import { AuthGuard } from '../auth/AuthGuard'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ReturnMsg } from '../../tool/open-api-body'
import { CreateproductTypeModelDto, ListproductTypeModelRequestDto, UpdateproductTypeModelDto } from './product-type.dto'

@Controller('product/product-type')
export class ProductTypeController {
    constructor(private productTypeService: ProductTypeService){}

    @Post('create')
    @UseGuards(AuthGuard)
    async create(@Body() createData: UpdateproductTypeModelDto) {
        return await this.productTypeService.create(createData)
    }
   
    @Post('update')
    @UseGuards(AuthGuard)
    async update(@Body() updateDto: UpdateproductTypeModelDto) {
        return await this.productTypeService.update(updateDto)
    }

    @Get('one/:id')
    @UseGuards(AuthGuard)
    async getOneById(@Param('id') id: string) {
        return await this.productTypeService.getOneById(id)
    }

    @Get('remove/:id')
    @UseGuards(AuthGuard)
    async removeById(@Param('id') id: string) {
        return await this.productTypeService.invalidate(id)
    }

    @Get('getAll')
    @UseGuards(AuthGuard)
    async getAll() {
        return this.productTypeService.findAll()
    }

    @Post('list')
    @UseGuards(AuthGuard)
    async listAndPage(@Body() req: ListproductTypeModelRequestDto) {
        return this.productTypeService.listPageRole(req)
    }

    @Post('batch-create')
    @UseGuards(AuthGuard)
    async importData(@Body() createDatas: CreateproductTypeModelDto[]) {
        return await this.productTypeService.importData(createDatas)
    }
}