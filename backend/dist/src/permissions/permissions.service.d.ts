import { PrismaService } from '../prisma/prisma.service';
export declare class PermissionsService {
    private prisma;
    constructor(prisma: PrismaService);
    getRolePermissions(role: string): Promise<Record<string, any>>;
    saveRolePermissions(role: string, matrix: Record<string, any>): Promise<{
        success: boolean;
    }>;
}
