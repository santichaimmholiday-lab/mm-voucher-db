import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(req: any): Promise<{
        id: string;
        created_at: Date;
        username: string;
        email: string;
        role: string;
    }[]>;
    create(createDto: any, req: any): Promise<{
        id: string;
        username: string;
        email: string;
        role: string;
    }>;
    changePassword(body: any, req: any): Promise<{
        success: boolean;
    }>;
    update(id: string, updateDto: any, req: any): Promise<{
        id: string;
        username: string;
        email: string;
        role: string;
    }>;
    remove(id: string, req: any): Promise<{
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
}
