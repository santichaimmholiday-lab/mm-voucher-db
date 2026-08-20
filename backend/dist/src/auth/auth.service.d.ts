import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    validateUser(emailOrUsername: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            email: any;
            sub: any;
            role: any;
        };
    }>;
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
    checkUserPermission(userId: string, roleName: string, module: string, action: string): Promise<boolean>;
}
