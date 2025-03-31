
import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import {  SysUserMoudule }from '../sys-user/sysUser.module'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from './constants'

@Module({
  imports: [SysUserMoudule, JwtModule.register({
    global: true,
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '48h' },
  })],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
