import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  async getRolePermissions(role: string) {
    const records = await this.prisma.tb_role_permission.findMany({
      where: { role }
    });
    
    // Convert to a dictionary
    const matrix: Record<string, any> = {};
    for (const r of records) {
      matrix[r.module] = {
        read: r.can_read,
        add: r.can_add,
        edit: r.can_edit,
        delete: r.can_delete,
        printx: r.can_printx,
        confirm: r.can_confirm,
        upload: r.can_upload
      };
    }
    return matrix;
  }

  async saveRolePermissions(role: string, matrix: Record<string, any>) {
    const modules = Object.keys(matrix);
    
    await this.prisma.$transaction(
      modules.map(mod => {
        const perms = matrix[mod];
        return this.prisma.tb_role_permission.upsert({
          where: {
            role_module: { role, module: mod }
          },
          update: {
            can_read: !!perms.read,
            can_add: !!perms.add,
            can_edit: !!perms.edit,
            can_delete: !!perms.delete,
            can_printx: !!perms.printx,
            can_confirm: !!perms.confirm,
            can_upload: !!perms.upload,
          },
          create: {
            role,
            module: mod,
            can_read: !!perms.read,
            can_add: !!perms.add,
            can_edit: !!perms.edit,
            can_delete: !!perms.delete,
            can_printx: !!perms.printx,
            can_confirm: !!perms.confirm,
            can_upload: !!perms.upload,
          }
        });
      })
    );
    return { success: true };
  }
}
