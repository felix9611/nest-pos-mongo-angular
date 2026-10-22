import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common'
import { DepartmentService } from './department.service';
import { CreateDeptBody, DepartmentBody, ListDepartmentQuery, ListDepartmentQueryRes, ListDeptRequestDto, UpdateDeptBody, UpdateDeptDto } from './department.dto';
import { AuthGuard } from '../auth/AuthGuard'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ReturnMsg } from '../../tool/open-api-body'
import { JwtPayload } from '../auth/auth.dto';

@Controller('sys/department')
export class DepartmentController {
    constructor(private deptService: DepartmentService){}

    @ApiOperation({ summary: 'Create Department' })
    @ApiBody({ type: CreateDeptBody })
    @ApiResponse({ description: 'If save successful', status: 201, type: DepartmentBody })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('create')
    @UseGuards(AuthGuard)
    async create(@Body() createData: UpdateDeptDto, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return await this.deptService.create(createData)
        } else {
            throw new HttpException({message: 'Access denied'}, HttpStatus.FORBIDDEN)
        }
    }

    @ApiOperation({ summary: 'Update Department' })
    @ApiBody({ type: UpdateDeptBody })
    @ApiResponse({ description: 'If not save successful',status: 200,type: ReturnMsg })
    @Post('update')
    @UseGuards(AuthGuard)
    async update(@Body() updateDto: UpdateDeptDto, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return await this.deptService.update(updateDto)
        } else {
            throw new HttpException({message: 'Access denied'}, HttpStatus.FORBIDDEN)
        }
    }

    @ApiOperation({ summary: 'Get One by Id' })
    @ApiResponse({ status: 201, type: DepartmentBody })
    @ApiResponse({ description: 'If no data', status: 200, type: ReturnMsg })
    @Get('one/:id')
    @UseGuards(AuthGuard)
    async getOneById(@Param('id') id: string, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return await this.deptService.getOneById(id)
        } else {
            throw new HttpException({message: 'Access denied'}, HttpStatus.FORBIDDEN)
        }
    }

    @ApiOperation({ summary: 'Void One by Id' })
    @ApiResponse({  description: 'Return message only', status: 200, type: ReturnMsg })
    @Get('remove/:id')
    @UseGuards(AuthGuard)
    async removeById(@Param('id') id: string, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return await this.deptService.invalidateDepartment(id)
        } else {
            throw new HttpException({message: 'Access denied'}, HttpStatus.FORBIDDEN)
        }
    }

    @ApiOperation({ summary: 'Get all data' })
    @ApiResponse({ status: 201, type: [DepartmentBody] })
    @Get('getAll')
    @UseGuards(AuthGuard)
    async getAll(@Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return this.deptService.findAll()
        } else {
            throw new HttpException({message: 'Access denied'}, HttpStatus.FORBIDDEN)
        }
    }

    @ApiOperation({ summary: 'List with filter' })
    @ApiBody({ type: ListDepartmentQuery })
    @ApiResponse({ status: 200,  type: [DepartmentBody] })
    @Post('filter/list')
    @UseGuards(AuthGuard)
    async listWithFilters(@Body() req: ListDeptRequestDto, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return this.deptService.listWithFilters(req)
        } else {
            throw new HttpException({message: 'Access denied'}, HttpStatus.FORBIDDEN)
        }
    }
    
    @ApiOperation({ summary: 'List and page' })
    @ApiBody({ type: ListDepartmentQuery })
    @ApiResponse({ status: 200,  type: ListDepartmentQueryRes })
    @Post('list')
    @UseGuards(AuthGuard)
    async listAndPage(@Body() req: ListDeptRequestDto, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return this.deptService.listPage(req)
        } else {
            throw new HttpException({message: 'Access denied'}, HttpStatus.FORBIDDEN)
        }
    }

    @ApiOperation({ summary: 'Batch Create Department' })
    @ApiBody({ type: [CreateDeptBody] })
    @ApiResponse({ description: 'If save successful', status: 201, type: DepartmentBody })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('batch-create')
    @UseGuards(AuthGuard)
    async importData(@Body() createDatas: UpdateDeptBody[], @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return await this.deptService.importData(createDatas)
        } else {
            throw new HttpException({message: 'Access denied'}, HttpStatus.FORBIDDEN)
        }
    }
    
}