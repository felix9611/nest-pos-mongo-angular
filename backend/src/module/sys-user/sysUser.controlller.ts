import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common'
import { SysUserService } from './sysUser.service'
import { CreateUserRequestDto, CreateUserDto, ListUserRequestDto, UpdateUserDto, CreateUserBody, FullUserBody, UpdateUserBody, SelfUpdatePasswordBody, UpdateAvatarBody, UpdatePasswordBody, ListSysUserQuery, SysRoleQueryRes } from './sysUser.dto'
import { AuthGuard } from '../auth/AuthGuard'
import { ReturnMsg } from 'src/tool/open-api-body'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'

@Controller('sys/user')
export class SysUserController {
    constructor(private readonly userService: SysUserService) {}

    @ApiOperation({ summary: 'Create System User' })
    @ApiBody({ type: CreateUserBody })
    @ApiResponse({ description: 'If save successful', status: 201, type: FullUserBody })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('create-user')
    @UseGuards(AuthGuard)
    async createUser(@Body() createUserRequest: CreateUserRequestDto) {
        return await this.userService.createUser(createUserRequest);
    }

    @ApiOperation({ summary: 'Update System User' })
    @ApiBody({ type: UpdateUserBody })
    @ApiResponse({ description: 'Return message only', status: 200, type: ReturnMsg })
    @Post('update-uesr')
    @UseGuards(AuthGuard)
    async updateUser(@Body() updateRequesr: UpdateUserDto) {
        return await this.userService.updateUser(updateRequesr)
    }

    @ApiOperation({ summary: 'Update Password By User Self' })
    @ApiBody({ type: SelfUpdatePasswordBody  })
    @ApiResponse({ description: 'Return message only', status: 200, type: ReturnMsg })
    @Post('user-self/update-password')
    @UseGuards(AuthGuard)
    async updatePasswordByUserSelf(@Body() updatePw: { password: string }, @Req() req: any) {
        return await this.userService.updatePassword(req.user.username, updatePw.password)
    }

    @ApiOperation({ summary: 'Update Avatar' })
    @ApiBody({ type: UpdateAvatarBody })
    @ApiResponse({ description: 'Return message only', status: 200, type: ReturnMsg })
    @Post('user-self/update-avatar')
    @UseGuards(AuthGuard)
    async updateAvatarByUserSelf(@Body() update: { photo: string }, @Req() req: any) {
        return await this.userService.updateAvatar(req.user.username, update.photo)
    }

    @ApiOperation({ summary: 'Update Password' })
    @ApiBody({ type: UpdatePasswordBody })
    @ApiResponse({ description: 'Return message only', status: 200, type: ReturnMsg })
    @Post('update-password')
    @UseGuards(AuthGuard)
    async updatePassword(@Body() updatePw: { password: string, username: string }) {
        return await this.userService.updatePassword(updatePw.username, updatePw.password)
    }

    @ApiOperation({ summary: 'Void One by Id' })
    @ApiResponse({  description: 'Return message only', status: 200, type: ReturnMsg })
    @Get('invalidate-user/:id')
    @UseGuards(AuthGuard)
    async invalidateUser(@Param('id') id: string) {
        return await this.userService.invalidateUser(id)
    }

    @ApiOperation({ summary: 'Get one by id' })
    @ApiResponse({ description: 'If not successful', status: 200, type: FullUserBody })
    @ApiResponse({ description: 'If not successful', status: 200, type: ReturnMsg })
    @Get('one/:id')
    @UseGuards(AuthGuard)
    async getUserInfoById(@Param('id') id: string) {
        return await this.userService.getUserInfo(id)
    }

    @ApiOperation({ summary: 'List and Page' })
    @ApiBody({ type: ListSysUserQuery })
    @ApiResponse({ description: 'Return data', status: 200, type: SysRoleQueryRes })
    @Post('list')
    @UseGuards(AuthGuard)
    async listPage(@Body() requestBody: ListUserRequestDto) {
        return await this.userService.listUser(requestBody)
    }

}