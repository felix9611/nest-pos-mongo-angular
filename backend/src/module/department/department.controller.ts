import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common'
import { DepartmentService } from './department.service';
import { CreateDeptBody, DepartmentBody, ListDepartmentQuery, ListDepartmentQueryRes, ListDeptRequestDto, UpdateDeptBody, UpdateDeptDto } from './department.dto';
import { AuthGuard } from '../auth/AuthGuard'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ReturnMsg } from '../../tool/open-api-body'

@Controller('sys/department')
export class DepartmentController {
    constructor(private deptService: DepartmentService){}

    @ApiOperation({ summary: 'Create Department' })
    @ApiBody({ type: CreateDeptBody })
    @ApiResponse({ description: 'If save successful', status: 201, type: DepartmentBody })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('create')
    @UseGuards(AuthGuard)
    async create(@Body() createData: UpdateDeptDto) {
        return await this.deptService.create(createData)
    }

    @ApiOperation({ summary: 'Update Department' })
    @ApiBody({ type: UpdateDeptBody })
    @ApiResponse({ description: 'If not save successful',status: 200,type: ReturnMsg })
    @Post('update')
    @UseGuards(AuthGuard)
    async update(@Body() updateDto: UpdateDeptDto) {
        return await this.deptService.update(updateDto)
    }

    @ApiOperation({ summary: 'Get One by Id' })
    @ApiResponse({ status: 201, type: DepartmentBody })
    @ApiResponse({ description: 'If no data', status: 200, type: ReturnMsg })
    @Get('one/:id')
    @UseGuards(AuthGuard)
    async getOneById(@Param('id') id: string) {
        return await this.deptService.getOneById(id)
    }

    @ApiOperation({ summary: 'Void One by Id' })
    @ApiResponse({  description: 'Return message only', status: 200, type: ReturnMsg })
    @Get('remove/:id')
    @UseGuards(AuthGuard)
    async removeById(@Param('id') id: string) {
        return await this.deptService.invalidateDepartment(id)
    }

    @ApiOperation({ summary: 'Get all data' })
    @ApiResponse({ status: 201, type: [DepartmentBody] })
    @Get('getAll')
    @UseGuards(AuthGuard)
    async getAll() {
        return this.deptService.findAll()
    }
    
    @ApiOperation({ summary: 'Lsit and page' })
    @ApiBody({ type: ListDepartmentQuery })
    @ApiResponse({ status: 200,  type: ListDepartmentQueryRes })
    @Post('list')
    @UseGuards(AuthGuard)
    async listAndPage(@Body() req: ListDeptRequestDto) {
        return this.deptService.listPageRole(req)
    }

    @ApiOperation({ summary: 'Batch Create Department' })
    @ApiBody({ type: [CreateDeptBody] })
    @ApiResponse({ description: 'If save successful', status: 201, type: DepartmentBody })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('batch-create')
    @UseGuards(AuthGuard)
    async importData(@Body() createDatas: UpdateDeptBody[]) {
        return await this.deptService.importData(createDatas)
    }
    
}