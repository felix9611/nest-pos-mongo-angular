import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common'
import { SysUserService } from './sysUser.service'
import { CreateUserRequestDto, CreateUserDto, ListUserRequestDto, UpdateUserDto } from './sysUser.dto'
import { AuthGuard } from '../auth/AuthGuard'

@Controller('sys/user')
export class SysUserController {
    constructor(private readonly userService: SysUserService) {}

    @Post('create-user')
    @UseGuards(AuthGuard)
    async createUser(@Body() createUserRequest: CreateUserRequestDto) {
        return await this.userService.createUser(createUserRequest);
    }

    @Post('update-uesr')
    @UseGuards(AuthGuard)
    async updateUser(@Body() updateRequesr: UpdateUserDto) {
        return await this.userService.updateUser(updateRequesr)
    }

    @Post('user-self/update-password')
    @UseGuards(AuthGuard)
    async updatePasswordByUserSelf(@Body() updatePw: { password: string }, @Req() req: any) {
        return await this.userService.updatePassword(req.user.username, updatePw.password)
    }

    @Post('user-self/update-avatar')
    @UseGuards(AuthGuard)
    async updateAvatarByUserSelf(@Body() update: { photo: string }, @Req() req: any) {
        return await this.userService.updateAvatar(req.user.username, update.photo)
    }

    @Post('update-password')
    @UseGuards(AuthGuard)
    async updatePassword(@Body() updatePw: { password: string, username: string }) {
        return await this.userService.updatePassword(updatePw.username, updatePw.password)
    }

    @Get('invalidate-user/:id')
    @UseGuards(AuthGuard)
    async invalidateUser(@Param('id') id: string) {
        return await this.userService.invalidateUser(id)
    }

    @Get('one/:id')
    @UseGuards(AuthGuard)
    async getUserInfoById(@Param('id') id: string) {
        return await this.userService.getUserInfo(id)
    }

    @Post('list')
    @UseGuards(AuthGuard)
    async listPage(@Body() requestBody: ListUserRequestDto) {
        return await this.userService.listUser(requestBody)
    }

}