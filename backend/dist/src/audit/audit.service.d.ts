import { PrismaService } from '../prisma/prisma.service';
export declare class AuditService {
    private prisma;
    constructor(prisma: PrismaService);
    logAction(userName: string, action: 'CREATE' | 'UPDATE' | 'DELETE', entityType: string, entityId: string, details?: any): Promise<void>;
    getEntityLogs(entityId: string): Promise<{
        id: string;
        created_at: Date;
        user_name: string;
        action: string;
        entity_type: string;
        entity_id: string;
        details: string | null;
    }[]>;
}
