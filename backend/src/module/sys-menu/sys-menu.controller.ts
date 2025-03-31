import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '../auth/AuthGuard'
import { SysMenuService } from './sys-menu.service'
import { SysMenuDto, SysMenuList, UpdateSysMenuDto } from './sys-menu.dto'

@Controller('sys/menu')
export class SysMenuController {
    constructor(private menuService: SysMenuService){}

    @Post('create')
    @UseGuards(AuthGuard)
    async create(@Body() createData: UpdateSysMenuDto) {
        return await this.menuService.create(createData)
    }

    @Post('update')
    @UseGuards(AuthGuard)
    async update(@Body() updateDto: UpdateSysMenuDto) {
        return await this.menuService.update(updateDto)
    }

    @Get('one/:id')
    @UseGuards(AuthGuard)
    async getOneById(@Param('id') id: string) {
        return await this.menuService.getOneById(id)
    }

    @Get('remove/:id')
    @UseGuards(AuthGuard)
    async removeById(@Param('id') id: string) {
        return await this.menuService.invalidate(id)
    }

    @Post('list')
    @UseGuards(AuthGuard)
    async list(@Body() req: SysMenuList) {
        return this.menuService.listAllMenu(req)
    }

    @Get('all-menu')
    @UseGuards(AuthGuard)
    async getTreeMenu() {
        return this.menuService.getAllMenu()
    }

    @Post('user/tree-menu')
    @UseGuards(AuthGuard)
    async getTreeMenuById(@Body() data: { ids: string[] }) {
        return await this.menuService.getTreeAllMenuById(data.ids)
    }

    @Get('main-item')
    @UseGuards(AuthGuard)
    async listAllMainIdMenu() {
        return this.menuService.listAllMainIdMenu()
    }
}