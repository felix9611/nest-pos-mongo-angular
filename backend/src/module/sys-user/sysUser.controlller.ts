import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common'
import { SysUserService } from './sysUser.service'
import { CreateUserRequestDto, CreateUserDto, ListUserRequestDto, UpdateUserDto, CreateUserBody, FullUserBody, UpdateUserBody, SelfUpdatePasswordBody, UpdateAvatarBody, UpdatePasswordBody, SysRoleQueryRes, ListSysUserQuery } from './sysUser.dto'
import { AuthGuard } from '../auth/AuthGuard'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReturnMsg } from 'src/tool/open-api-body';
import { JwtPayload } from '../auth/auth.dto';

@Controller('sys/user')
export class SysUserController {
    constructor(private readonly userService: SysUserService) {}

    @ApiOperation({ summary: 'Create System User' })
    @ApiBody({ type: CreateUserBody })
    @ApiResponse({ description: 'If save successful', status: 201, type: FullUserBody })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('create-user')
    @UseGuards(AuthGuard)
    async createUser(@Body() createUserRequest: CreateUserRequestDto, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return await this.userService.createUser(createUserRequest)
        } else {
            throw new HttpException({ message: 'Access denied' }, HttpStatus.FORBIDDEN)
        }
    }

    @ApiOperation({ summary: 'Update System User' })
    @ApiBody({ type: UpdateUserBody })
    @ApiResponse({ description: 'Return message only', status: 200, type: ReturnMsg })
    @Post('update-uesr')
    @UseGuards(AuthGuard)
    async updateUser(@Body() updateRequesr: UpdateUserDto, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return await this.userService.updateUser(updateRequesr)
        } else {
            throw new HttpException({ message: 'Access denied' }, HttpStatus.FORBIDDEN)
        }
    }

    @ApiOperation({ summary: 'Update Password By User Self' })
    @ApiBody({ type: SelfUpdatePasswordBody  })
    @ApiResponse({ description: 'Return message only', status: 200, type: ReturnMsg })
    @Post('user-self/update-password')
    @UseGuards(AuthGuard)
    async updatePasswordByUserSelf(@Body() updatePw: { password: string }, @Req() { user }: { user: JwtPayload }) {
        if (user.username) {
            return await this.userService.updatePassword(user.username, updatePw.password)
        } else {
            throw new HttpException({ message: 'Access denied' }, HttpStatus.FORBIDDEN)
        }
    }

    @ApiOperation({ summary: 'Update Avatar' })
    @ApiBody({ type: UpdateAvatarBody })
    @ApiResponse({ description: 'Return message only', status: 200, type: ReturnMsg })
    @Post('user-self/update-avatar')
    @UseGuards(AuthGuard)
    async updateAvatarByUserSelf(@Body() update: { photo: string }, @Req() { user }: { user: JwtPayload }) {
        if (user.username) {
            return await this.userService.updateAvatar(user.username, update.photo)
        } else {
            throw new HttpException({ message: 'Access denied' }, HttpStatus.FORBIDDEN)
        }
    }

    @ApiOperation({ summary: 'Update Password' })
    @ApiBody({ type: UpdatePasswordBody })
    @ApiResponse({ description: 'Return message only', status: 200, type: ReturnMsg })
    @Post('update-password')
    @UseGuards(AuthGuard)
    async updatePassword(@Body() updatePw: { password: string, username: string }, @Req() { user }: { user: JwtPayload }) {
        if (user.username) {
            return await this.userService.updatePassword(updatePw.username, updatePw.password)
        } else {
            throw new HttpException({ message: 'Access denied' }, HttpStatus.FORBIDDEN)
        }
    }

    @ApiOperation({ summary: 'Void One by Id' })
    @ApiResponse({  description: 'Return message only', status: 200, type: ReturnMsg })
    @Get('invalidate-user/:id')
    @UseGuards(AuthGuard)
    async invalidateUser(@Param('id') id: string, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return await this.userService.invalidateUser(id)
        } else {
            throw new HttpException({ message: 'Access denied' }, HttpStatus.FORBIDDEN)
        }
    }


    @ApiOperation({ summary: 'Get one by id' })
    @ApiResponse({ description: 'If not successful', status: 200, type: FullUserBody })
    @ApiResponse({ description: 'If not successful', status: 200, type: ReturnMsg })
    @Get('one/:id')
    @UseGuards(AuthGuard)
    async getUserInfoById(@Param('id') id: string, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return await this.userService.getUserInfo(id)
        } else {
            throw new HttpException({ message: 'Access denied' }, HttpStatus.FORBIDDEN)
        }
    }

    @ApiOperation({ summary: 'List and Page' })
    @ApiBody({ type: ListSysUserQuery })
    @ApiResponse({ description: 'Return data', status: 200, type: SysRoleQueryRes })
    @Post('list')
    @UseGuards(AuthGuard)
    async listPage(@Body() requestBody: ListUserRequestDto, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return await this.userService.listUser(requestBody)
        } else {
            throw new HttpException({ message: 'Access denied' }, HttpStatus.FORBIDDEN)
        }
    }

}