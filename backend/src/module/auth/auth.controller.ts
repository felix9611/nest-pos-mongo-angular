
import { Body, Controller, Post, Get, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthGuard } from './AuthGuard'
import { SysUserService } from '../sys-user/sysUser.service'
import { Public } from './public.decorator'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { LoginBody, TokenBody, UserDetailDto, VerifyTokenRes } from './auth.dto'
import { ReturnMsg } from 'src/tool/open-api-body'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: SysUserService) {}

  @ApiOperation({ summary: 'Login'})
  @ApiBody({ type: LoginBody })
  @ApiResponse({ status: 200, description: 'Login successful', type: TokenBody })
  @ApiResponse({ status: 201, description: 'If Login unsuccessful', type: ReturnMsg })
  @Public()
  @Post('login')
  async signIn(@Body() signInDto: { username: string, password: string, ipAddress: string}) {
    return await this.authService.signIn(signInDto.username, signInDto.password, signInDto.ipAddress)
  }

  @ApiOperation({ summary: 'Verfiy Token'})
  @ApiResponse({ status: 200, description: 'If successful', type: VerifyTokenRes })
  @ApiResponse({ status: 201, description: 'If unsuccessful', type: ReturnMsg })
  @Get('verify-token')
  @UseGuards(AuthGuard)
  async verfiyToken(@Req() req: any) {
    return await this.authService.verifyToken(req.headers.authorization)
  }

  @ApiOperation({ summary: 'Get User Profile'})
  @ApiResponse({ status: 200, description: 'If successful', type: UserDetailDto })
  @Get('user-profile')
  @UseGuards(AuthGuard)
  async getUserProfile(@Req() req: any) {
    return await this.userService.findOneUser(req.user.username)
  }
}