import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common'
import { CreateLocationBody, CreateLocationDto, ListLocationQuery, ListLocationQueryRes, ListLocationRequestDto, LocationBody, UpdateLocationBody, UpdateLocationDto } from './location.dto'
import { AuthGuard } from '../auth/AuthGuard'
import { LocationService } from './location.service'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ReturnMsg } from '../../tool/open-api-body'
import { JwtPayload } from '../auth/auth.dto'

@Controller('base/location')
export class LocationController {
    constructor(private locationService: LocationService){}

    @ApiOperation({ summary: 'Create Location' })
    @ApiBody({ type: CreateLocationBody })
    @ApiResponse({ description: 'If save successful', status: 201, type: LocationBody })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('create')
    @UseGuards(AuthGuard)
    async create(@Body() createData: UpdateLocationDto, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return await this.locationService.create(createData)
        } else {
            throw new HttpException({message: 'Access denied'}, HttpStatus.FORBIDDEN)
        }
    }

    @ApiOperation({ summary: 'Update Location' })
    @ApiBody({ type: UpdateLocationBody })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('update')
    @UseGuards(AuthGuard)
    async update(@Body() updateDto: UpdateLocationDto, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return await this.locationService.update(updateDto)
        } else {
            throw new HttpException({message: 'Access denied'}, HttpStatus.FORBIDDEN)
        }
    }

    @ApiOperation({ summary: 'Get one by ID' })
    @ApiResponse({ description: 'If successful', status: 201, type: LocationBody })
    @ApiResponse({ description: 'If no data', status: 200, type: ReturnMsg })
    @Get('one/:id')
    @UseGuards(AuthGuard)
    async getOneById(@Param('id') id: string, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return await this.locationService.getOneById(id)
        } else {
            throw new HttpException({message: 'Access denied'}, HttpStatus.FORBIDDEN)
        }
    }

    @ApiOperation({ summary: 'Void one by ID' })
    @ApiResponse({ description: 'Return message only', status: 200, type: ReturnMsg })
    @Get('remove/:id')
    @UseGuards(AuthGuard)
    async removeById(@Param('id') id: string, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return await this.locationService.invalidate(id)
        } else {
            throw new HttpException({message: 'Access denied'}, HttpStatus.FORBIDDEN)
        }
    }

    @ApiOperation({ summary: 'Get all Data' })
    @ApiResponse({ description: 'If successful', status: 201, type: [LocationBody] })
    @Get('getAll')
    @UseGuards(AuthGuard)
    async getAll(@Req() { user }: { user: JwtPayload }) {
        return await this.locationService.findAll()
    }
    
    @ApiOperation({ summary: 'Page and list'})
    @ApiBody({ type: ListLocationQuery })
    @ApiResponse({ description: 'If successful', status: 201, type: ListLocationQueryRes })
    @Post('list')
    @UseGuards(AuthGuard)
    async listAndPage(@Body() req: ListLocationRequestDto, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return await this.locationService.listPage(req)
        } else {
            throw new HttpException({message: 'Access denied'}, HttpStatus.FORBIDDEN)
        }
    }

    @ApiOperation({ summary: 'List with filter'})
    @ApiBody({ type: ListLocationQuery })
    @ApiResponse({ description: 'If successful', status: 201, type: [LocationBody] })
    @Post('filter/list')
    @UseGuards(AuthGuard)
    async listWithFilter(@Body() req: ListLocationRequestDto, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return await this.locationService.listWithFilter(req)
        } else {
            throw new HttpException({message: 'Access denied'}, HttpStatus.FORBIDDEN)
        }
    }

    @ApiOperation({ summary: 'Batch Create' })
    @ApiBody({ type: [CreateLocationBody] })
    @ApiResponse({ description: 'If save successful', status: 201, type: LocationBody })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('batch-create')
    @UseGuards(AuthGuard)
    async importData(@Body() createDatas: CreateLocationBody[], @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return await this.locationService.importData(createDatas as CreateLocationDto[])
        } else {
            throw new HttpException({message: 'Access denied'}, HttpStatus.FORBIDDEN)
        }
    }
}