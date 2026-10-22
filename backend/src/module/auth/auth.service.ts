import { Injectable, UnauthorizedException } from '@nestjs/common'
import { SysUserService } from '../sys-user/sysUser.service'
import { JwtService } from '@nestjs/jwt'
import { hashPassword, salt } from '../../tool/password-tools'
import { jwtConstants } from './constants'
import { JwtPayload } from './auth.dto'

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
      const payload = { sub: user._id, username: user.username, departmentIds: user.deptIds, placeIds: user.placeIds, roles: user.roles, superAdmin: user.superAdmin }
      await this.usersService.saveLoginRecord(username, ipAddress, 'Success')
      return {
        accessToken: await this.jwtService.signAsync(payload),
      }
    }
    
  }

  async verifyToken(token: string) {
    const [type, tokenString] = token.split(' ') ?? []
    if (type === 'Bearer') {
      try {
        const decoded = await this.jwtService.verifyAsync<JwtPayload>(tokenString)
        return {
          status: true,
              user: {
              userId: decoded.sub,
              username: decoded.username,
              departmentIds: decoded.departmentIds,
              placeIds: decoded.placeIds,
              roles: decoded.roles,
              superAdmin: decoded.superAdmin,
          },
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
}
