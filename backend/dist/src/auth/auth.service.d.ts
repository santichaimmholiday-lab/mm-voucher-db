import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    checkUserPermission(userId: string, roleName: string, module: string, action: string): Promise<boolean>;
    getMyPermissions(userId: string, roleName: string): Promise<{
        isAdmin: boolean;
        granted: string[];
    } | {
        isAdmin: boolean;
        granted: {
            module: string;
            actions: string[];
        }[];
    }>;
}
