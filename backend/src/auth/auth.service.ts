import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Replicates Legacy Logic: Auth_a_m.php check_auth()
   * 1. Checks if Admin -> Handled in RolesGuard
   * 2. Checks Group Permissions (tb_securable_group) -> RolePermissions
   * 3. Checks User Permissions (tb_securable_user) -> UserPermissions
   */
  async checkUserPermission(userId: string, roleName: string, module: string, action: string): Promise<boolean> {
    // A real implementation would query Prisma here.
    // e.g. 
    // const groupPerm = await this.prisma.rolePermission.findFirst({ ... });
    // if (groupPerm && groupPerm[action] === 'on') return true;
    
    // const userPerm = await this.prisma.userPermission.findFirst({ ... });
    // if (userPerm && userPerm[action] === 'on') return true;

    // Mock response for now
    if (roleName === 'Manager' && action === 'printx') return true;
    
    return false;
  }

  async getMyPermissions(userId: string, roleName: string) {
    if (roleName === 'Admin') {
      return {
        isAdmin: true,
        granted: ['*']
      };
    }

    // Mock query logic returning matrix
    return {
      isAdmin: false,
      granted: [
        { module: 'Voucher', actions: ['read', 'add', 'edit'] },
        { module: 'Master_location', actions: ['read'] }
      ]
    };
  }
}
