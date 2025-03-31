
import { Body, Controller, Post, Get, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthGuard } from './AuthGuard'
import { SysUserService } from '../sys-user/sysUser.service'
import { Public } from './public.decorator'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: SysUserService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  async signIn(@Body() signInDto: { username: string, password: string, ipAddress: string}) {
    return await this.authService.signIn(signInDto.username, signInDto.password, signInDto.ipAddress)
  }

  @Get('verify-token')
  @UseGuards(AuthGuard)
  async verfiyToken(@Req() req: any) {
    return await this.authService.verifyToken(req.headers.authorization)
  }

  @Get('user-profile')
  @UseGuards(AuthGuard)
  async getUserProfile(@Req() req: any) {
    return await this.userService.findOneUser(req.user.username)
  }
}