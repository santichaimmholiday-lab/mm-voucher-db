import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getStats(startDate?: string, endDate?: string): Promise<{
        summary: {
            totalVouchers: number;
            waitingVouchers: number;
            confirmedVouchers: number;
            cancelledVouchers: number;
            totalCustomers: number;
        };
        trend: {
            date: string;
            vouchers: number;
        }[];
        byType: {
            name: string;
            value: number;
        }[];
        recentVouchers: {
            id: string;
            voucher_status: string;
            voucher_no: string;
            voucher_issue_date: Date;
            voucher_guest_name: string;
            voucher_type: string;
        }[];
    }>;
}
