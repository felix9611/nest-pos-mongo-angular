import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { ExcelFieldMatchService } from './excelFieldMatch.service'
import { ExcelFieldMatchListRequestDto, ExcelFieldMatchUpdate } from './excelFieldMatch.dto'
import { AuthGuard } from '../auth/AuthGuard'

@Controller('sys/excel-field-match')
export class ExcelFieldMatchController {
    constructor(private excelFieldMatchService: ExcelFieldMatchService) {}

    @Post('create')
    @UseGuards(AuthGuard)
    async create(@Body() createData: ExcelFieldMatchUpdate) {
        return await this.excelFieldMatchService.create(createData)
    }

    @Post('update')
    @UseGuards(AuthGuard)
    async update(@Body() updateDto: ExcelFieldMatchUpdate) {
        return await this.excelFieldMatchService.update(updateDto)
    }

    @Get('one/:id')
    @UseGuards(AuthGuard)
    async getOneById(@Param('id') id: string) {
        return await this.excelFieldMatchService.getOneById(id)
    }

    @Get('code/:code')
    @UseGuards(AuthGuard)
    async getOneByCode(@Param('code') code: string) {
        return await this.excelFieldMatchService.getOneByCode(code)
    }

    @Get('remove/:id')
    @UseGuards(AuthGuard)
    async removeById(@Param('id') id: string) {
        return await this.excelFieldMatchService.invalidate(id)
    }

    @Post('list')
    @UseGuards(AuthGuard)
    async listAndPage(@Body() req: ExcelFieldMatchListRequestDto) {
        return this.excelFieldMatchService.listAndPage(req)
    }
}