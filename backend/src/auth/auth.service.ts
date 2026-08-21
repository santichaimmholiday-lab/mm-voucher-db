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
    
    const permission = await this.prisma.tb_role_permission.findUnique({
      where: {
        role_module: { role: roleName, module }
      }
    });

    if (!permission) return false;

    switch (action.toLowerCase()) {
      case 'read': return permission.can_read;
      case 'add': return permission.can_add;
      case 'edit': return permission.can_edit;
      case 'delete': return permission.can_delete;
      case 'printx': return permission.can_printx;
      case 'confirm': return permission.can_confirm;
      case 'upload': return permission.can_upload;
      default: return false;
    }
  }
}
