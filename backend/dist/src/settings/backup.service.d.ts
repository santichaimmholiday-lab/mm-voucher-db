import { PrismaService } from '../prisma/prisma.service';
export declare class BackupService {
    private prisma;
    constructor(prisma: PrismaService);
    generateExcelBackup(res: any): Promise<void>;
}
