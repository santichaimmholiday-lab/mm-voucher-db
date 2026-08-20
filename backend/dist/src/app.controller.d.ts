import { PrismaService } from './prisma/prisma.service';
export declare class AppController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    checkHealth(): Promise<{
        status: string;
        timestamp: Date;
        db_awake: boolean;
        user_count: number;
    }>;
}
