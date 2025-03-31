import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common'
import { LocationService } from './location.service'
import { AuthGuard } from '../auth/AuthGuard'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ReturnMsg } from '../../tool/open-api-body'
import { CreateLocationDto, ListLocationRequestDto, UpdateLocationDto } from './location.dto'

@Controller('base/location')
export class LocationController {
    constructor(private locationService: LocationService){}

    @Post('create')
    @UseGuards(AuthGuard)
    async create(@Body() createData: UpdateLocationDto) {
        return await this.locationService.create(createData)
    }
   
    @Post('update')
    @UseGuards(AuthGuard)
    async update(@Body() updateDto: UpdateLocationDto) {
        return await this.locationService.update(updateDto)
    }

    @Get('one/:id')
    @UseGuards(AuthGuard)
    async getOneById(@Param('id') id: string) {
        return await this.locationService.getOneById(id)
    }

    @Get('remove/:id')
    @UseGuards(AuthGuard)
    async removeById(@Param('id') id: string) {
        return await this.locationService.invalidate(id)
    }

    @Get('getAll')
    @UseGuards(AuthGuard)
    async getAll() {
        return this.locationService.findAll()
    }

    @Post('list')
    @UseGuards(AuthGuard)
    async listAndPage(@Body() req: ListLocationRequestDto) {
        return this.locationService.listPageRole(req)
    }

    @Post('batch-create')
    @UseGuards(AuthGuard)
    async importData(@Body() createDatas: CreateLocationDto[]) {
        return await this.locationService.importData(createDatas)
    }
}