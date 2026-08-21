"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStats(startDate, endDate) {
        const whereCondition = { is_deleted: false };
        if (startDate || endDate) {
            whereCondition.voucher_issue_date = {};
            if (startDate)
                whereCondition.voucher_issue_date.gte = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                whereCondition.voucher_issue_date.lte = end;
            }
        }
        const totalVouchers = await this.prisma.tb_voucher.count({ where: whereCondition });
        const waitingVouchers = await this.prisma.tb_voucher.count({ where: { ...whereCondition, voucher_status: 'Waiting' } });
        const confirmedVouchers = await this.prisma.tb_voucher.count({ where: { ...whereCondition, voucher_status: 'Confirmed' } });
        const cancelledVouchers = await this.prisma.tb_voucher.count({ where: { ...whereCondition, voucher_status: 'Cancelled' } });
        const customerWhere = { is_deleted: false };
        if (startDate || endDate) {
            customerWhere.created_at = {};
            if (startDate)
                customerWhere.created_at.gte = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                customerWhere.created_at.lte = end;
            }
        }
        const totalCustomers = await this.prisma.tb_customer.count({ where: customerWhere });
        const vouchers = await this.prisma.tb_voucher.findMany({
            where: whereCondition,
            select: { voucher_issue_date: true, voucher_type: true }
        });
        const trendMap = {};
        const typeMap = {};
        vouchers.forEach(v => {
            const dateStr = v.voucher_issue_date.toISOString().split('T')[0];
            trendMap[dateStr] = (trendMap[dateStr] || 0) + 1;
            const type = v.voucher_type || 'Unknown';
            typeMap[type] = (typeMap[type] || 0) + 1;
        });
        const trend = Object.keys(trendMap).sort().map(date => ({
            date,
            vouchers: trendMap[date]
        }));
        const byType = Object.keys(typeMap).map(name => ({
            name,
            value: typeMap[name]
        }));
        const recentVouchers = await this.prisma.tb_voucher.findMany({
            where: whereCondition,
            orderBy: { created_at: 'desc' },
            take: 10,
            select: {
                id: true,
                voucher_no: true,
                voucher_guest_name: true,
                voucher_status: true,
                voucher_issue_date: true,
                voucher_type: true
            }
        });
        return {
            summary: {
                totalVouchers,
                waitingVouchers,
                confirmedVouchers,
                cancelledVouchers,
                totalCustomers
            },
            trend,
            byType,
            recentVouchers
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map