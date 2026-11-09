import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { SysUserMoudule }from '../sys-user/sysUser.module'
import { ApiKeyMoudule } from '../apikey/apikey.module'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [
    SysUserMoudule, 
    ApiKeyMoudule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],  
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        issuer: configService.get<string>('JWT_ISSUER'),
        signOptions: { expiresIn: '1d' }
      }),
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
