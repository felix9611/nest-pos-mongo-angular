import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common'
import { SysRoleService } from './role.service';
import { CreateSysRoleDto, ListRoleRequestDto, UpdateSysRoleDto } from './role.dto';
import { AuthGuard } from '../auth/AuthGuard';

@Controller('sys/role')
export class SysRoleController {
    constructor(private sysRoleService: SysRoleService){}

    @Post('create')
    @UseGuards(AuthGuard)
    async create(@Body() createData: UpdateSysRoleDto) {
        return await this.sysRoleService.create(createData)
    }

    @Post('update')
    @UseGuards(AuthGuard)
    async update(@Body() updateDto: UpdateSysRoleDto) {
        return await this.sysRoleService.update(updateDto)
    }

    @Post('update-permission')
    @UseGuards(AuthGuard)
    async updateRoleMenuPermission(@Body() updateDto: { id: string, menuIds: any }) {
        return await this.sysRoleService.updateRoleMenuPermission(updateDto.id, updateDto.menuIds)
    }

    @Get('one/:id')
    @UseGuards(AuthGuard)
    async getOneById(@Param('id') id: string) {
        return await this.sysRoleService.getOneById(id)
    }

    @Get('remove/:id')
    @UseGuards(AuthGuard)
    async removeById(@Param('id') id: string) {
        return await this.sysRoleService.invalidateRole(id)
    }

    @Get('getAll')
    @UseGuards(AuthGuard)
    async getAll() {
        return this.sysRoleService.findAll()
    }
    
    @Post('list')
    @UseGuards(AuthGuard)
    async listAndPage(@Body() req: ListRoleRequestDto) {
        return this.sysRoleService.listPageRole(req)
    }
    
    @Post('list-permission')
    @UseGuards(AuthGuard)
    async listPermission(@Body() req: { roleIds: any }) {
        return this.sysRoleService.loadRoleWithMenu(req.roleIds)
    }

}