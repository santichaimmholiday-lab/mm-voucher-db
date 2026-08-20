import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    private supabase;
    constructor(settingsService: SettingsService);
    getSettings(): Promise<{}>;
    updateSettings(data: any): Promise<{
        id: string;
        company_name: string | null;
        company_name_th: string | null;
        company_address: string | null;
        company_tel: string | null;
        company_email: string | null;
        company_web: string | null;
        tat_license: string | null;
        logo_image_path: string | null;
        qr_code_path: string | null;
        condition_booking: string | null;
        condition_hotel: string | null;
        condition_tour: string | null;
        updated_at: Date;
    }>;
    uploadFile(file: Express.Multer.File): Promise<{
        url: any;
    }>;
}
