import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { ExcelFieldMatchService } from './excelFieldMatch.service'
import { ExcelFieldMatchBody, ExcelFieldMatchListQuery, ExcelFieldMatchListRequestDto, ExcelFieldMatchListResponseBody, ExcelFieldMatchUpdate, ExcelFieldMatchUpdateBody } from './excelFieldMatch.dto'
import { AuthGuard } from '../auth/AuthGuard'
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger'
import { ReturnMsg } from 'src/tool/open-api-body'

@Controller('sys/excel-field-match')
export class ExcelFieldMatchController {
    constructor(private excelFieldMatchService: ExcelFieldMatchService) {}

    @ApiOperation({ summary: 'Create Excel Field Match' })
    @ApiBody({ type: ExcelFieldMatchUpdateBody })
    @ApiResponse({ description: 'If save successful', status: 201, type: ExcelFieldMatchBody })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('create')
    @UseGuards(AuthGuard)
    async create(@Body() createData: ExcelFieldMatchUpdate) {
        return await this.excelFieldMatchService.create(createData)
    }

    @ApiOperation({ summary: 'Update Excel Field Match' })
    @ApiBody({ type: ExcelFieldMatchUpdateBody })
    @ApiResponse({ description: 'Return message only', status: 200, type: ReturnMsg })
    @Post('update')
    @UseGuards(AuthGuard)
    async update(@Body() updateDto: ExcelFieldMatchUpdate) {
        return await this.excelFieldMatchService.update(updateDto)
    }

    @ApiOperation({ summary: 'Get by id' })
    @ApiResponse({ description: 'If save successful', status: 201, type: ExcelFieldMatchBody })
    @ApiResponse({ description: 'If not successful', status: 200, type: ReturnMsg })
    @Get('one/:id')
    @UseGuards(AuthGuard)
    async getOneById(@Param('id') id: string) {
        return await this.excelFieldMatchService.getOneById(id)
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
    async removeById(@Param('id') id: string) {
        return await this.excelFieldMatchService.invalidate(id)
    }

    @ApiOperation({ summary: 'Page and list'})
    @ApiBody({ type: ExcelFieldMatchListQuery })
    @ApiResponse({ description: 'If successful', status: 201, type: ExcelFieldMatchListResponseBody })
    @Post('list')
    @UseGuards(AuthGuard)
    async listAndPage(@Body() req: ExcelFieldMatchListRequestDto) {
        return this.excelFieldMatchService.listAndPage(req)
    }
}