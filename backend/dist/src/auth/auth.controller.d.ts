import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    getProfile(req: any): any;
    getMyPermissions(req: any): Promise<{
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
