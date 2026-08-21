import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(startDate?: string, endDate?: string) {
    const whereCondition: any = { is_deleted: false };

    if (startDate || endDate) {
      whereCondition.voucher_issue_date = {};
      if (startDate) whereCondition.voucher_issue_date.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        whereCondition.voucher_issue_date.lte = end;
      }
    }

    // 1. Basic Summary
    const totalVouchers = await this.prisma.tb_voucher.count({ where: whereCondition });
    const waitingVouchers = await this.prisma.tb_voucher.count({ where: { ...whereCondition, voucher_status: 'Waiting' } });
    const confirmedVouchers = await this.prisma.tb_voucher.count({ where: { ...whereCondition, voucher_status: 'Confirmed' } });
    const cancelledVouchers = await this.prisma.tb_voucher.count({ where: { ...whereCondition, voucher_status: 'Cancelled' } });
    
    // Total customers created in this period
    const customerWhere: any = { is_deleted: false };
    if (startDate || endDate) {
      customerWhere.created_at = {};
      if (startDate) customerWhere.created_at.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        customerWhere.created_at.lte = end;
      }
    }
    const totalCustomers = await this.prisma.tb_customer.count({ where: customerWhere });

    // 2. Trend (Vouchers per day)
    const vouchers = await this.prisma.tb_voucher.findMany({
      where: whereCondition,
      select: { voucher_issue_date: true, voucher_type: true }
    });

    const trendMap: Record<string, number> = {};
    const typeMap: Record<string, number> = {};

    vouchers.forEach(v => {
      // Trend by date
      const dateStr = v.voucher_issue_date.toISOString().split('T')[0];
      trendMap[dateStr] = (trendMap[dateStr] || 0) + 1;

      // Distribution by Type
      const type = v.voucher_type || 'Unknown';
      typeMap[type] = (typeMap[type] || 0) + 1;
    });

    // Sort trend map by date
    const trend = Object.keys(trendMap).sort().map(date => ({
      date,
      vouchers: trendMap[date]
    }));

    const byType = Object.keys(typeMap).map(name => ({
      name,
      value: typeMap[name]
    }));

    // 3. Recent Vouchers
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
}
