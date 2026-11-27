import { Injectable, UnauthorizedException } from '@nestjs/common'
import { SysUserService } from '../sys-user/sysUser.service'
import { JwtService } from '@nestjs/jwt'
import { hashPassword, salt } from '../../tool/password-tools'
import { ApiKeyLoginBody, InvalidApiAddress } from './auth.dto'
import { env } from 'process'
import { isIP } from 'net'
import { ApiKeyService } from '../apikey/apikey.service'

@Injectable()
export class AuthService {
    constructor(
      private usersService: SysUserService,
      private apiKeyService: ApiKeyService,
      private jwtService: JwtService
    ) {}

  async signIn(
    username: string,
    password: string,
    ipAddress: string,
    ray: string
  ): Promise<any> {
    const ip = typeof ipAddress === 'string'? ipAddress.trim(): ''

    // Validate IP address and Ray ID
    if (!ip || !isIP(ip) || InvalidApiAddress.includes(ip) || (process.env.PROD === 'YES' ? !ray?.trim() : ray)) {
      await this.usersService.saveLoginRecord(username, ip, 'Failed', ray)

      throw new UnauthorizedException(
        'Not allowed to login!'
      )
    }

    const user = await this.usersService.findOneUserAllData(username)

    // Validate user and password
    const passwordString = hashPassword(password, salt)

    if (!user || user.password !== passwordString) {
      await this.usersService.saveLoginRecord(username, ip, 'Failed', ray)

      throw new UnauthorizedException('Not allowed to login!')
    }

    const payload = {
      sub: user._id,
      username: user.username,
      departmentIds: user.deptIds,
      placeIds: user.placeIds,
      deptIds: user.deptIds,
      roles: user.roles,
      superAdmin: user.superAdmin,
      manager: user.manager
    }

    const accessToken = await this.jwtService.signAsync(
      payload,
      {
        secret: env.JWT_SECRET,
        issuer: env.JWT_ISSUER
      }
    )

    await this.usersService.saveLoginRecord(username, ip, 'Success', ray)

    return { accessToken }
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
    const data = await this.apiKeyService.getKeyData(req.source)

     if (!data) {
      return {
        msg: 'Source not found'
      }
    }

    const keyString = hashPassword(req.answer, salt)

    if (data.key !== keyString) {
      return {
        msg: 'Answer not match!'
      }
    } else {
      const apiPayload = {
        issuer: env.JWT_ISSUER,
        source: data.source
      }

      return {
        accessToken: await this.jwtService.signAsync(apiPayload, {
          secret: env.JWT_SECRET,
          issuer: env.JWT_ISSUER
        })
      }
    }
  }
}
