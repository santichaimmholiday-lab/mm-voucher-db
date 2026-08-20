import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        created_at: Date;
        username: string;
        email: string;
        role: string;
    }[]>;
    create(data: any): Promise<{
        id: string;
        username: string;
        email: string;
        role: string;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        username: string;
        email: string;
        role: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        username: string;
        email: string;
        password: string;
        role: string;
    }>;
    changePassword(userId: string, oldPass: string, newPass: string): Promise<{
        success: boolean;
    }>;
}
