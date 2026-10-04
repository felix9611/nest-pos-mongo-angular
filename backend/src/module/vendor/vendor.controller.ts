import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common'
import { VendorService } from './vendor.service';
import { CreateVendorBody, CreateVendorDto, ListVendorQuery, ListVendorQueryRes, ListVendorRequestDto, UpdateVendorBody, UpdateVendorDto, VendorBody } from './vendor.dto';
import { AuthGuard } from '../auth/AuthGuard';
import { ApiResponse, ApiOperation, ApiBody } from '@nestjs/swagger';
import { ReturnMsg } from 'src/tool/open-api-body';

@Controller('base/vendor')
export class VendorController {
    constructor(private vendorService: VendorService) {}

    @ApiOperation({ summary: 'Create Vendor' })
    @ApiBody({ type: UpdateVendorBody })
    @ApiResponse({ description: 'If save successful', status: 201, type: VendorBody })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('create')
    @UseGuards(AuthGuard)
    async create(@Body() createData: UpdateVendorDto) {
        return await this.vendorService.create(createData);
    }

    @ApiOperation({ summary: 'Update Vendor' })
    @ApiBody({ type: UpdateVendorBody })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('update')
    @UseGuards(AuthGuard)
    async update(@Body() updateDto: UpdateVendorDto) {
        return await this.vendorService.update(updateDto);
    }

    @ApiOperation({ summary: 'Get one by ID' })
    @ApiResponse({ description: 'If successful', status: 201, type: VendorBody })
    @ApiResponse({ description: 'If no data', status: 200, type: ReturnMsg })
    @Get('one/:id')
    @UseGuards(AuthGuard)
    async getOneById(@Param('id') id: string) {
        return await this.vendorService.getOneById(id)
    }

    @ApiOperation({ summary: 'Void one by ID' })
    @ApiResponse({ description: 'Return message only', status: 200, type: ReturnMsg })
    @Get('remove/:id')
    @UseGuards(AuthGuard)
    async removeById(@Param('id') id: string) {
        return await this.vendorService.invalidateDepartment(id)
    }

    @ApiOperation({ summary: 'Get All Vendors' })
    @ApiResponse({ description: 'If successful', status: 201, type: VendorBody, isArray: true })
    @Get('getAll')
    @UseGuards(AuthGuard)
    async getAll() {
        return this.vendorService.findAll()
    }

    @ApiOperation({ summary: 'List with filter'})
    @ApiBody({ type: ListVendorQuery })
    @ApiResponse({ description: 'If successful', status: 201, type: ListVendorQueryRes })
    @Post('filter/list')
    @UseGuards(AuthGuard)
    async listWithFilter(@Body() req: ListVendorRequestDto) {
        return this.vendorService.listWithFilter(req)
    }
    
    @ApiOperation({ summary: 'Page and list'})
    @ApiBody({ type: ListVendorQuery })
    @ApiResponse({ description: 'If successful', status: 201, type: ListVendorQueryRes })
    @Post('list')
    @UseGuards(AuthGuard)
    async listAndPage(@Body() req: ListVendorRequestDto) {
        return this.vendorService.listPage(req)
    }

    @ApiOperation({ summary: 'Batch to Create Vendor' })
    @ApiBody({ type: CreateVendorBody, isArray: true })
    @ApiResponse({ description: 'If save successful', status: 201, type: VendorBody, isArray: true })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('batch-create')
    @UseGuards(AuthGuard)
    async batchCreate(@Body() createDatas: CreateVendorDto[]) {
        return await this.vendorService.importData(createDatas)
    }
    
}

// Removed incorrect custom implementation of ApiOperation
