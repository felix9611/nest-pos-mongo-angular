import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '../auth/AuthGuard'
import { SysMenuService } from './sys-menu.service'
import { ListTreeMenuBody, MainMenuBody, MenuQueryBody, SysMenuBody, SysMenuDto, SysMenuList, TreeMenuBody, UpdateSysMenuDto } from './sys-menu.dto'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ReturnMsg } from 'src/tool/open-api-body'
import { UpdateSysRole } from '../sys-role/role.dto'

@Controller('sys/menu')
export class SysMenuController {
    constructor(private menuService: SysMenuService){}

    @ApiOperation({ summary: 'Create Menu' })
    @ApiBody({ type: UpdateSysRole })
    @ApiResponse({ description: 'If save successful', status: 201, type: SysMenuBody })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('create')
    @UseGuards(AuthGuard)
    async create(@Body() createData: UpdateSysMenuDto) {
        return await this.menuService.create(createData)
    }

    @ApiOperation({ summary: 'Update Menu' })
    @ApiBody({ type: UpdateSysRole })
    @ApiResponse({ description: 'If save successful', status: 201, type: ReturnMsg })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('update')
    @UseGuards(AuthGuard)
    async update(@Body() updateDto: UpdateSysMenuDto) {
        return await this.menuService.update(updateDto)
    }

    @ApiOperation({ summary: 'Get Menu by id' })
    @ApiResponse({ description: 'If save successful', status: 201, type: SysMenuBody })
    @ApiResponse({ description: 'If no data', status: 200, type: ReturnMsg })
    @Get('one/:id')
    @UseGuards(AuthGuard)
    async getOneById(@Param('id') id: string) {
        return await this.menuService.getOneById(id)
    }

    @ApiOperation({ summary: 'Void One by Id' })
    @ApiResponse({  description: 'Return message only', status: 200, type: ReturnMsg })
    @Get('remove/:id')
    @UseGuards(AuthGuard)
    async removeById(@Param('id') id: string) {
        return await this.menuService.invalidate(id)
    }

    @ApiOperation({ summary: 'List menu' })
    @ApiBody({ type: MenuQueryBody })
    @ApiResponse({ description: 'If successful', status: 201, type: TreeMenuBody, isArray: true })
    @Post('list')
    @UseGuards(AuthGuard)
    async list(@Body() req: SysMenuList) {
        return this.menuService.listAllMenu(req)
    }

    @ApiOperation({ summary: 'All menu items' })
    @ApiResponse({ description: 'If successful', status: 201, type: SysMenuBody, isArray: true })
    @Get('all-menu')
    @UseGuards(AuthGuard)
    async getTreeMenu() {
        return this.menuService.getAllMenu()
    }

    @ApiOperation({ summary: 'List tree menu' })
    @ApiBody({ type: ListTreeMenuBody })
    @ApiResponse({ description: 'If successful', status: 201, type: TreeMenuBody, isArray: true })
    @Post('user/tree-menu')
    @UseGuards(AuthGuard)
    async getTreeMenuById(@Body() data: { ids: string[] }) {
        return await this.menuService.getTreeAllMenuById(data.ids)
    }

    @ApiOperation({ summary: 'List main menus' })
    @ApiResponse({  description: 'Return', status: 200, type: MainMenuBody, isArray: true })
    @Get('main-item')
    @UseGuards(AuthGuard)
    async listAllMainIdMenu() {
        return this.menuService.listAllMainIdMenu()
    }
}