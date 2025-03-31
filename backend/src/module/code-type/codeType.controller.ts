import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common'
import { CreateCodeTypeBody, ListCodeTypeRequestDto, UpdateCodeTypeDto, CodeTypeBody, ListCodeTypeQuery, ListCodeTypeQueryRes, UpdateCodeTypeBody } from './codeType.dto'
import { AuthGuard } from '../auth/AuthGuard'
import { CodeTypeService } from './codeType.service'
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ReturnMsg } from '../../tool/open-api-body'

@ApiTags('Code Type')
@Controller('base/code-type')
export class CodeTypeController {
    constructor(private codeTypeService: CodeTypeService){}

    @ApiOperation({ summary: 'Create Code Type' })
    @ApiBody({ description: 'Create Code Type', type: CreateCodeTypeBody })
    @ApiResponse({ description: 'If save successful', status: 201, type: CodeTypeBody  })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('create')
    @UseGuards(AuthGuard)
    async create(@Body() createData: UpdateCodeTypeDto) {
        return await this.codeTypeService.create(createData)
    }

    @ApiOperation({ summary: 'Update Code Type' })
    @ApiBody({ type: UpdateCodeTypeBody })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('update')
    @UseGuards(AuthGuard)
    async update(@Body() updateDto: UpdateCodeTypeDto) {
        return await this.codeTypeService.update(updateDto)
    }

    @ApiOperation({ summary: 'Get one data by id'})
    @ApiResponse({ description: 'If successful', status: 201, type: CodeTypeBody })
    @ApiResponse({ description: 'If not successful', status: 200, type: ReturnMsg })
    @Get('one/:id')
    @UseGuards(AuthGuard)
    async getOneById(@Param('id') id: string) {
        return await this.codeTypeService.getOneById(id)
    }

    @ApiOperation({ summary: 'Void data by Id'})
    @ApiResponse({ description: 'Return message only', status: 200, type: ReturnMsg })
    @Get('remove/:id')
    @UseGuards(AuthGuard)
    async removeById(@Param('id') id: string) {
        return await this.codeTypeService.invalidateDepartment(id)
    }

    @ApiOperation({ summary: 'Get all data'})
    @ApiResponse({ description: 'If successful', status: 201, type: [CodeTypeBody] })
    @Get('getAll')
    @UseGuards(AuthGuard)
    async getAll() {
        return this.codeTypeService.findAll()
    }
    
    @ApiOperation({ summary: 'Page and list'})
    @ApiBody({ type: ListCodeTypeQuery })
    @ApiResponse({ description: 'If successful', status: 201, type: ListCodeTypeQueryRes })
    @Post('list')
    @UseGuards(AuthGuard)
    async listAndPage(@Body() req: ListCodeTypeRequestDto) {
        return this.codeTypeService.listPageRole(req)
    }

    @ApiOperation({ summary: 'Get data by type'})
    @ApiResponse({ description: 'If save successful', status: 201, type: [CodeTypeBody] })
    @Get('get-type/:type')
    @UseGuards(AuthGuard)
    async getByType(@Param('type') type: string) {
        return await this.codeTypeService.getByType(type)
    }

    @ApiOperation({ summary: 'Create Code Type' })
    @ApiBody({ description: 'Create Code Type', type: [CreateCodeTypeBody] })
    @ApiResponse({ description: 'return meessage', status: 200, type: ReturnMsg })
    @Post('batch-create')
    @UseGuards(AuthGuard)
    async importData(@Body() importData: CreateCodeTypeBody[]) {
        return await this.codeTypeService.importData(importData)
    }
    
}