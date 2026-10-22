import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common'
import { ExcelFieldMatchService } from './excelFieldMatch.service'
import { ExcelFieldMatchBody, ExcelFieldMatchListQuery, ExcelFieldMatchListRequestDto, ExcelFieldMatchListResponseBody, ExcelFieldMatchUpdate, ExcelFieldMatchUpdateBody } from './excelFieldMatch.dto'
import { AuthGuard } from '../auth/AuthGuard'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ReturnMsg } from 'src/tool/open-api-body'
import { JwtPayload } from '../auth/auth.dto'

@Controller('sys/excel-field-match')
export class ExcelFieldMatchController {
    constructor(private excelFieldMatchService: ExcelFieldMatchService) {}

    @ApiOperation({ summary: 'Create Excel Field Match' })
    @ApiBody({ type: ExcelFieldMatchUpdateBody })
    @ApiResponse({ description: 'If save successful', status: 201, type: ExcelFieldMatchBody })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('create')
    @UseGuards(AuthGuard)
    async create(@Body() createData: ExcelFieldMatchUpdate, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return await this.excelFieldMatchService.create(createData)
        } else {
            throw new HttpException({message: 'Access denied'}, HttpStatus.FORBIDDEN)
        }
    }

    @ApiOperation({ summary: 'Update Excel Field Match' })
    @ApiBody({ type: ExcelFieldMatchUpdateBody })
    @ApiResponse({ description: 'Return message only', status: 200, type: ReturnMsg })
    @Post('update')
    @UseGuards(AuthGuard)
    async update(@Body() updateDto: ExcelFieldMatchUpdate, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return await this.excelFieldMatchService.update(updateDto)
        } else {
            throw new HttpException({message: 'Access denied'}, HttpStatus.FORBIDDEN)
        }
    }

    @ApiOperation({ summary: 'Get by id' })
    @ApiResponse({ description: 'If save successful', status: 201, type: ExcelFieldMatchBody })
    @ApiResponse({ description: 'If not successful', status: 200, type: ReturnMsg })
    @Get('one/:id')
    @UseGuards(AuthGuard)
    async getOneById(@Param('id') id: string, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return await this.excelFieldMatchService.getOneById(id)
        } else {
            throw new HttpException({message: 'Access denied'}, HttpStatus.FORBIDDEN)
        }
    }

    @ApiOperation({ summary: 'Get by code' })
    @ApiResponse({ description: 'If successful', status: 201, type: ExcelFieldMatchBody })
    @ApiResponse({ description: 'If not successful', status: 200, type: ReturnMsg })
    @Get('code/:code')
    @UseGuards(AuthGuard)
    async getOneByCode(@Param('code') code: string) {
        return await this.excelFieldMatchService.getOneByCode(code)
    }

    @ApiOperation({ summary: 'Void one by ID' })
    @ApiResponse({ description: 'Return message only', status: 200, type: ReturnMsg })
    @Get('remove/:id')
    @UseGuards(AuthGuard)
    async removeById(@Param('id') id: string, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return await this.excelFieldMatchService.invalidate(id)
        } else {
            throw new HttpException({message: 'Access denied'}, HttpStatus.FORBIDDEN)
        }
    }

    @ApiOperation({ summary: 'Page and list'})
    @ApiBody({ type: ExcelFieldMatchListQuery })
    @ApiResponse({ description: 'If successful', status: 201, type: ExcelFieldMatchListResponseBody })
    @Post('list')
    @UseGuards(AuthGuard)
    async listAndPage(@Body() req: ExcelFieldMatchListRequestDto, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return this.excelFieldMatchService.listAndPage(req)
        } else {
            throw new HttpException({message: 'Access denied'}, HttpStatus.FORBIDDEN)
        }
    }
}