import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(emailOrUsername: string, pass: string): Promise<any> {
    // 1. Check Master / Emergency Account first
    if (emailOrUsername === process.env.MASTER_USER && pass === process.env.MASTER_PASS) {
      return {
        id: 'master-0000',
        email: emailOrUsername + '@master.local',
        username: emailOrUsername,
        role: 'Admin', // Give highest privileges
      };
    }

    // 2. Normal Database Check
    const user = await this.prisma.tb_user.findFirst({
      where: {
        OR: [
          { email: emailOrUsername },
          { username: emailOrUsername }
        ]
      }
    });

    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: payload
    };
  }

  async getMyPermissions(userId: string, roleName: string) {
    if (roleName === 'Admin') {
      return {
        isAdmin: true,
        granted: ['*']
      };
    }
    return {
      isAdmin: false,
      granted: [
        { module: 'Voucher', actions: ['read', 'add', 'edit'] },
        { module: 'Master_location', actions: ['read'] }
      ]
    };
  }

  async checkUserPermission(userId: string, roleName: string, module: string, action: string): Promise<boolean> {
    if (roleName === 'Admin') return true;
    if (roleName === 'Manager' && action === 'printx') return true;
    
    // Default pass for now since we just need basic login
    return true; 
  }
}
