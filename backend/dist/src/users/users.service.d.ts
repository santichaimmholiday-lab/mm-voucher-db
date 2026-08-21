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
    remove(id: string, userId: string): Promise<{
        id: string;
        is_deleted: boolean;
        created_at: Date;
        updated_at: Date;
        deleted_by: string | null;
        deleted_at: Date | null;
        username: string;
        email: string;
        password: string;
        role: string;
    }>;
    changePassword(userId: string, oldPass: string, newPass: string): Promise<{
        success: boolean;
    }>;
}
