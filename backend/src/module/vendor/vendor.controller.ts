import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common'
import { VendorService } from './vendor.service';
import { CreateVendorDto, ListVendorRequestDto, UpdateVendorDto } from './vendor.dto';
import { AuthGuard } from '../auth/AuthGuard';

@Controller('base/vendor')
export class VendorController {
    constructor(private vendorService: VendorService){}

    @Post('create')
    @UseGuards(AuthGuard)
    async create(@Body() createData: UpdateVendorDto) {
        return await this.vendorService.create(createData)
    }

    @Post('update')
    @UseGuards(AuthGuard)
    async update(@Body() updateDto: UpdateVendorDto) {
        return await this.vendorService.update(updateDto)
    }

    @Get('one/:id')
    @UseGuards(AuthGuard)
    async getOneById(@Param('id') id: string) {
        return await this.vendorService.getOneById(id)
    }

    @Get('remove/:id')
    @UseGuards(AuthGuard)
    async removeById(@Param('id') id: string) {
        return await this.vendorService.invalidateDepartment(id)
    }

    @Get('getAll')
    @UseGuards(AuthGuard)
    async getAll() {
        return this.vendorService.findAll()
    }
    
    @Post('list')
    @UseGuards(AuthGuard)
    async listAndPage(@Body() req: ListVendorRequestDto) {
        return this.vendorService.listPageRole(req)
    }

    @Post('batch-create')
    @UseGuards(AuthGuard)
    async batchCreate(@Body() createDatas: CreateVendorDto[]) {
        return await this.vendorService.importData(createDatas)
    }
    
}