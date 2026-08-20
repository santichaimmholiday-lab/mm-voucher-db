import { PrismaService } from '../prisma/prisma.service';
export declare class SettingsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getSettings(): Promise<{}>;
    updateSettings(data: any): Promise<{
        id: string;
        updated_at: Date;
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
    }>;
}
