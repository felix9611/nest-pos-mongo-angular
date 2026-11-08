import { Injectable, UnauthorizedException } from '@nestjs/common'
import { SysUserService } from '../sys-user/sysUser.service'
import { JwtService } from '@nestjs/jwt'
import { hashPassword, salt } from '../../tool/password-tools'
import { jwtConstants } from './constants'
import { ApiKeyLoginBody, JwtPayload } from './auth.dto'
import { env } from 'process'

@Injectable()
export class AuthService {
    constructor(
        private usersService: SysUserService,
        private jwtService: JwtService
    ) {}

  async signIn(
    username: string,
    password: string,
    ipAddress: string
  ): Promise<any> {
    console.log(username)
    const user = await this.usersService.findOneUserAllData(username)

    if (!user) {
      return {
        msg: 'Username not found'
      }
    }

    const passwordString = hashPassword(password, salt)

    if (user?.password !== passwordString) {

      await this.usersService.saveLoginRecord(username, ipAddress, 'Failed')

      return {
        msg: 'Password not match!'
      }
    } else {
      const payload = { 
        sub: user._id, 
        username: user.username, 
        departmentIds: user.deptIds, 
        placeIds: user.placeIds, 
        roles: user.roles, 
        superAdmin: user.superAdmin, 
        manager: user.manager 
      }
      await this.usersService.saveLoginRecord(username, ipAddress, 'Success')
      return {
        accessToken: await this.jwtService.signAsync(payload, {
          secret: env.JWT_SECRET,
          issuer: env.JWT_ISSUER
        })
      }
    }
    
  }

  async verifyToken(token: string) {
    const [type, tokenString] = token.split(' ') ?? []
    if (type === 'Bearer') {
      try {
        const decoded = await this.jwtService.verifyAsync(tokenString, {
          secret: env.JWT_SECRET,
          issuer: env.JWT_ISSUER
        })

        const user = await this.usersService.findOneUserAllData(decoded.username)

        if (!user) {
          throw new UnauthorizedException('Invalid access')
        } else {
          return {
            status: true
          }
        }
      } catch (error) {
        throw new UnauthorizedException('Invalid or expired token')
      }
    } else {
      return {
        msg: 'Invalid token!'
      }
    }
  }

  async apiLogin(req: ApiKeyLoginBody) {
    

    const apiPayload = {
      // sourceSystem: req.source,
    }
  }
}
