import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common'
import { CreateCodeTypeBody, ListCodeTypeRequestDto, UpdateCodeTypeDto, CodeTypeBody, ListCodeTypeQuery, ListCodeTypeQueryRes, UpdateCodeTypeBody } from './codeType.dto'
import { AuthGuard } from '../auth/AuthGuard'
import { CodeTypeService } from './codeType.service'
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ReturnMsg } from '../../tool/open-api-body'
import { JwtPayload } from '../auth/auth.dto'

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
    async create(@Body() createData: UpdateCodeTypeDto, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return await this.codeTypeService.create(createData)
        } else {
            throw new HttpException({message: 'Access denied'}, HttpStatus.FORBIDDEN)
        }
    }

    @ApiOperation({ summary: 'Update Code Type' })
    @ApiBody({ type: UpdateCodeTypeBody })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('update')
    @UseGuards(AuthGuard)
    async update(@Body() updateDto: UpdateCodeTypeDto, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return await this.codeTypeService.update(updateDto)
        } else {
            throw new HttpException({message: 'Access denied'}, HttpStatus.FORBIDDEN)
        }
    }

    @ApiOperation({ summary: 'Get one data by id'})
    @ApiResponse({ description: 'If successful', status: 201, type: CodeTypeBody })
    @ApiResponse({ description: 'If not successful', status: 200, type: ReturnMsg })
    @Get('one/:id')
    @UseGuards(AuthGuard)
    async getOneById(@Param('id') id: string, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return await this.codeTypeService.getOneById(id)
        } else {
            throw new HttpException({message: 'Access denied'}, HttpStatus.FORBIDDEN)
        }
    }

    @ApiOperation({ summary: 'Void data by Id'})
    @ApiResponse({ description: 'Return message only', status: 200, type: ReturnMsg })
    @Get('remove/:id')
    @UseGuards(AuthGuard)
    async removeById(@Param('id') id: string, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return await this.codeTypeService.invalidateDepartment(id)
        } else {
            throw new HttpException({message: 'Access denied'}, HttpStatus.FORBIDDEN)
        }
    }

    @ApiOperation({ summary: 'Get all data'})
    @ApiResponse({ description: 'If successful', status: 201, type: [CodeTypeBody] })
    @Get('getAll')
    @UseGuards(AuthGuard)
    async getAll(@Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return this.codeTypeService.findAll()
        } else {
            throw new HttpException({message: 'Access denied'}, HttpStatus.FORBIDDEN)
        }
    }

    @ApiOperation({ summary: 'List with filter'})
    @ApiBody({ type: ListCodeTypeQuery })
    @ApiResponse({ description: 'If successful', status: 201, type: [CodeTypeBody] })
    @Post('filter/list')
    @UseGuards(AuthGuard)
    async listWithFilter(@Body() req: ListCodeTypeRequestDto, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return this.codeTypeService.listWithFilter(req)
        } else {
            throw new HttpException({message: 'Access denied'}, HttpStatus.FORBIDDEN)
        }
    }
    
    @ApiOperation({ summary: 'Page and list'})
    @ApiBody({ type: ListCodeTypeQuery })
    @ApiResponse({ description: 'If successful', status: 201, type: ListCodeTypeQueryRes })
    @Post('list')
    @UseGuards(AuthGuard)
    async listAndPage(@Body() req: ListCodeTypeRequestDto, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return this.codeTypeService.listPage(req)
        } else {
            throw new HttpException({message: 'Access denied'}, HttpStatus.FORBIDDEN)
        }
    }

    @ApiOperation({ summary: 'Get data by type'})
    @ApiResponse({ description: 'If save successful', status: 201, type: [CodeTypeBody] })
    @Get('get-type/:type')
    @UseGuards(AuthGuard)
    async getByType(@Param('type') type: string) {
        return await this.codeTypeService.getByType(type)
    }

    @ApiOperation({ summary: 'Batch create Code Type' })
    @ApiBody({ description: 'Create Code Type', type: [CreateCodeTypeBody] })
    @ApiResponse({ description: 'return meessage', status: 200, type: ReturnMsg })
    @Post('batch-create')
    @UseGuards(AuthGuard)
    async importData(@Body() importData: CreateCodeTypeBody[], @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return await this.codeTypeService.importData(importData)
        } else {
            throw new HttpException({message: 'Access denied'}, HttpStatus.FORBIDDEN)
        }
    }
    
}