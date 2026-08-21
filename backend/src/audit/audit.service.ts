import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async logAction(
    userName: string,
    action: 'CREATE' | 'UPDATE' | 'DELETE',
    entityType: string,
    entityId: string,
    details?: any
  ) {
    try {
      await this.prisma.tb_audit_log.create({
        data: {
          user_name: userName,
          action,
          entity_type: entityType,
          entity_id: entityId,
          details: details ? (typeof details === 'string' ? details : JSON.stringify(details)) : null
        }
      });
    } catch (err) {
      console.error('Failed to write audit log:', err);
    }
  }

  async getEntityLogs(entityId: string) {
    return this.prisma.tb_audit_log.findMany({
      where: { entity_id: entityId },
      orderBy: { created_at: 'desc' }
    });
  }
}
