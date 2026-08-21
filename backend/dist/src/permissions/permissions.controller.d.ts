import { PermissionsService } from './permissions.service';
export declare class PermissionsController {
    private readonly permissionsService;
    constructor(permissionsService: PermissionsService);
    getRolePermissions(role: string): Promise<Record<string, any>>;
    saveRolePermissions(role: string, matrix: Record<string, any>): Promise<{
        success: boolean;
    }>;
}
