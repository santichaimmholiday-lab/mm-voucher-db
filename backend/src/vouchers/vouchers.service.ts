import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 
import * as QRCode from 'qrcode';
import html_to_pdf from 'html-pdf-node';
import { generateVoucherHtml } from './voucher-pdf.template';

@Injectable()
export class VouchersService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalVouchers, waitingVouchers, todayVouchers, totalCustomers, recentVouchers] = await Promise.all([
      this.prisma.tb_voucher.count({ where: { is_deleted: false } }),
      this.prisma.tb_voucher.count({ where: { is_deleted: false, voucher_status: 'Waiting' } }),
      this.prisma.tb_voucher.count({ where: { is_deleted: false, created_at: { gte: today } } }),
      this.prisma.tb_customer.count({ where: { is_deleted: false } }),
      this.prisma.tb_voucher.findMany({
        where: { is_deleted: false },
        orderBy: { created_at: 'desc' },
        take: 5,
        include: {
          hotel: true,
          tour: true,
          attraction: true
        }
      })
    ]);

    return {
      totalVouchers,
      waitingVouchers,
      todayVouchers,
      totalCustomers,
      recentVouchers
    };
  }

  private async generateVoucherNumber(issueDate: string): Promise<string> {
    const year = issueDate.substring(2, 4); // "YY"
    const month = issueDate.substring(5, 7); // "MM"
    const prefix = `MM${year}${month}`;

    const lastVoucher = await this.prisma.tb_voucher.findFirst({
      where: { voucher_no: { startsWith: prefix } },
      orderBy: { voucher_no: 'desc' },
    });

    let nextNumber = 1;
    if (lastVoucher && lastVoucher.voucher_no) {
      const lastNumberStr = lastVoucher.voucher_no.substring(prefix.length);
      nextNumber = parseInt(lastNumberStr, 10) + 1;
    }

    const paddedNumber = String(nextNumber).padStart(4, '0');
    return `${prefix}${paddedNumber}`;
  }

  async create(createDto: any, userId: string) {
    const { hotel, tour, ...voucherData } = createDto;

    const companyInfo = await this.prisma.tb_customer.findFirst({
      where: { cus_name: voucherData.voucher_company || '', is_deleted: false }
    });

    const voucher_no = await this.generateVoucherNumber(voucherData.voucher_issue_date);

    try {
      return await this.prisma.$transaction(async (tx) => {
        const voucher = await tx.tb_voucher.create({
          data: {
            ...voucherData,
            voucher_no,
            voucher_status: 'Waiting',
            created_by: userId,
          }
        });
        return voucher;
      });
    } catch (error) {
      console.error('Prisma Transaction Error:', error);
      throw new InternalServerErrorException('Failed to create composite voucher transaction');
    }
  }

  async findAll(page: number = 1, limit: number = 10, search?: string, advanced?: string) {
    const skip = (page - 1) * limit;
    const take = limit;
    
    let where: any = { is_deleted: false };

    // 1. Global Search
    if (search) {
      where.OR = [
        { voucher_no: { contains: search } },
        { voucher_guest_name: { contains: search } },
        { voucher_company: { contains: search } },
        { voucher_status: { contains: search } },
      ];
    }

    // 2. Advanced Filters
    if (advanced) {
      try {
        const filters = JSON.parse(advanced);
        const advancedWhere: any[] = [];
        
        filters.forEach((f: any) => {
          if (!f.field || !f.operator || !f.value) return;
          
          let condition: any = {};
          
          if (f.operator === 'contains') condition[f.field] = { contains: f.value };
          else if (f.operator === 'startsWith') condition[f.field] = { startsWith: f.value };
          else if (f.operator === 'endsWith') condition[f.field] = { endsWith: f.value };
          else if (f.operator === 'equals') condition[f.field] = { equals: f.value };
          else if (f.operator === 'gt') condition[f.field] = { gt: f.value };
          else if (f.operator === 'lt') condition[f.field] = { lt: f.value };
          else if (f.operator === 'between' && f.valueTo) {
            const isDate = f.field === 'voucher_issue_date' || f.field.includes('date');
            if (isDate) {
              const toDate = new Date(f.valueTo);
              toDate.setHours(23, 59, 59, 999);
              condition[f.field] = {
                gte: new Date(f.value),
                lte: toDate
              };
            } else {
              condition[f.field] = {
                gte: f.value,
                lte: f.valueTo
              };
            }
          }

          if (Object.keys(condition).length > 0) {
            advancedWhere.push(condition);
          }
        });

        if (advancedWhere.length > 0) {
          where.AND = advancedWhere;
        }
      } catch (e) {
        console.error('Failed to parse advanced filters', e);
      }
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.tb_voucher.findMany({
        where,
        skip,
        take,
        orderBy: { voucher_no: 'desc' },
        include: {
          hotel: true,
          attraction: true,
          tour: true
        }
      }),
      this.prisma.tb_voucher.count({ where })
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findOne(id: string) {
    const voucher = await this.prisma.tb_voucher.findFirst({
      where: { id, is_deleted: false },
      include: {
        hotel: true,
        attraction: true,
        tour: true,
        pickup_hotel: true
      }
    });
    if (!voucher) throw new NotFoundException('Voucher not found');
    return voucher;
  }

  async update(id: string, updateDto: any, userId: string) {
    const { hotel, tour, attraction, created_at, updated_at, created_by, updated_by, ...voucherData } = updateDto;

    try {
      return await this.prisma.$transaction(async (tx) => {
        const voucher = await tx.tb_voucher.update({
          where: { id },
          data: {
            ...voucherData,
            updated_by: userId,
            updated_at: new Date()
          }
        });
        return voucher;
      });
    } catch (error) {
      console.error('Prisma Transaction Error (Update):', error);
      throw new InternalServerErrorException('Failed to update voucher');
    }
  }

  async remove(id: string, userId: string) {
    return this.prisma.tb_voucher.update({
      where: { id },
      data: { is_deleted: true, deleted_by: userId, deleted_at: new Date() }
    });
  }

  async generatePdf(id: string): Promise<Buffer> {
    const voucher = await this.findOne(id);
    const settings = await this.prisma.tb_system_settings.findFirst() || {};

    // Public URL that the QR code points to (Frontend proxy handles this)
    const publicUrl = `http://localhost:5173/api/vouchers/${id}/pdf`;
    const qrCodeBase64 = await QRCode.toDataURL(publicUrl, { margin: 1 });

    const htmlContent = generateVoucherHtml(voucher, settings, qrCodeBase64);

    const options = { format: 'A4', printBackground: true };
    const file = { content: htmlContent };

    return await html_to_pdf.generatePdf(file, options);
  }
}

