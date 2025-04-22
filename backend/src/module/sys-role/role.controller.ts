import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common'
import { SysRoleService } from './role.service';
import { CreateSysRole, CreateSysRoleDto, ListPermissionBody, ListRoleRequestDto, ListSysRoleQuery, SysRoleBody, SysRoleBodyWithMenu, SysRoleQueryRes, UpdateRoleMenuPermissionBody, UpdateSysRole, UpdateSysRoleDto } from './role.dto';
import { AuthGuard } from '../auth/AuthGuard';
import { ReturnMsg } from 'src/tool/open-api-body';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('sys/role')
export class SysRoleController {
    constructor(private sysRoleService: SysRoleService){}

    @ApiOperation({ summary: 'Create System Role' })
    @ApiBody({ type: CreateSysRole })
    @ApiResponse({ description: 'If save successful', status: 201, type: SysRoleBody })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('create')
    @UseGuards(AuthGuard)
    async create(@Body() createData: UpdateSysRoleDto) {
        return await this.sysRoleService.create(createData)
    }

    @ApiOperation({ summary: 'Update System Role' })
    @ApiBody({ type: UpdateSysRole })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('update')
    @UseGuards(AuthGuard)
    async update(@Body() updateDto: UpdateSysRoleDto) {
        return await this.sysRoleService.update(updateDto)
    }

    @ApiOperation({ summary: 'Update System Role' })
    @ApiBody({ type: UpdateRoleMenuPermissionBody })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('update-permission')
    @UseGuards(AuthGuard)
    async updateRoleMenuPermission(@Body() updateDto: { id: string, menuIds: any }) {
        return await this.sysRoleService.updateRoleMenuPermission(updateDto.id, updateDto.menuIds)
    }

    @ApiOperation({ summary: 'Get One by Id' })
    @ApiResponse({ status: 201, type: SysRoleBody })
    @ApiResponse({ description: 'If no data', status: 200, type: ReturnMsg })
    @Get('one/:id')
    @UseGuards(AuthGuard)
    async getOneById(@Param('id') id: string) {
        return await this.sysRoleService.getOneById(id)
    }

    @ApiOperation({ summary: 'Void One by Id' })
    @ApiResponse({  description: 'Return message only', status: 200, type: ReturnMsg })
    @Get('remove/:id')
    @UseGuards(AuthGuard)
    async removeById(@Param('id') id: string) {
        return await this.sysRoleService.invalidateRole(id)
    }

    @ApiOperation({ summary: 'Get all data' })
    @ApiResponse({ status: 201, type: [SysRoleBody] })
    @Get('getAll')
    @UseGuards(AuthGuard)
    async getAll() {
        return this.sysRoleService.findAll()
    }
    
    @ApiOperation({ summary: 'Lsit and page' })
    @ApiBody({ type: ListSysRoleQuery })
    @ApiResponse({ status: 200,  type: SysRoleQueryRes })
    @Post('list')
    @UseGuards(AuthGuard)
    async listAndPage(@Body() req: ListRoleRequestDto) {
        return this.sysRoleService.listPageRole(req)
    }
    
    @ApiOperation({ summary: 'Lsit permission menu list' })
    @ApiBody({ type: ListPermissionBody })
    @ApiResponse({ status: 200,  type: SysRoleBodyWithMenu })
    @Post('list-permission')
    @UseGuards(AuthGuard)
    async listPermission(@Body() req: { roleIds: any }) {
        return this.sysRoleService.loadRoleWithMenu(req.roleIds)
    }

}