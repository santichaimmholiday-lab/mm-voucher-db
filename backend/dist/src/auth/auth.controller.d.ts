import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: any): Promise<{
        access_token: string;
        user: {
            email: any;
            sub: any;
            role: any;
        };
    }>;
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
