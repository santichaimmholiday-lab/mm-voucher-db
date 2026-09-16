import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 
import { AuditService } from '../audit/audit.service';
import * as QRCode from 'qrcode';
import html_to_pdf from 'html-pdf-node';
import { generateVoucherHtml } from './voucher-pdf.template';

@Injectable()
export class VouchersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService
  ) {}

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

  async getNextNumberPreview(date?: string) {
    const issueDate = date || new Date().toISOString();
    const nextNo = await this.generateVoucherNumber(issueDate);
    return { voucher_no: nextNo };
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

    let voucher_no = voucherData.voucher_no;
    let numberChanged = false;

    if (voucher_no) {
      const existing = await this.prisma.tb_voucher.findFirst({ where: { voucher_no } });
      if (existing) {
        voucher_no = await this.generateVoucherNumber(voucherData.voucher_issue_date);
        numberChanged = true;
      }
    } else {
      voucher_no = await this.generateVoucherNumber(voucherData.voucher_issue_date);
    }

    try {
        return await this.prisma.$transaction(async (tx) => {
          const voucher = await tx.tb_voucher.create({
            data: {
              ...voucherData,
              voucher_no,
              voucher_status: voucherData.voucher_status || 'Confirmed',
              created_by: userId,
            }
          });
          
          await this.auditService.logAction(userId, 'CREATE', 'VOUCHER', voucher.id, {
            voucher_no: voucher.voucher_no,
            voucher_type: voucher.voucher_type,
            guest_name: voucher.voucher_guest_name
          });

          return { ...voucher, _numberChanged: numberChanged };
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
    const voucher = await this.prisma.tb_voucher.findUnique({
      where: { id, is_deleted: false },
      include: {
        attraction: true,
        hotel: true,
        pickup_hotel: true,
        tour: true
      }
    });
    if (!voucher) throw new NotFoundException('Voucher not found');
    return voucher;
  }

  async getLogs(id: string) {
    return this.auditService.getEntityLogs(id);
  }

  async update(id: string, updateDto: any, userId: string) {
    const { hotel, tour, attraction, created_at, updated_at, created_by, updated_by, ...voucherData } = updateDto;

    try {
        return await this.prisma.$transaction(async (tx) => {
          const oldVoucher = await tx.tb_voucher.findUnique({ where: { id } });
          const voucher = await tx.tb_voucher.update({
            where: { id },
            data: {
              ...voucherData,
              updated_by: userId,
              updated_at: new Date()
            }
          });
          
          let details = `Updated voucher`;
          if (oldVoucher?.voucher_status !== voucher.voucher_status) {
            details = `Changed status from ${oldVoucher?.voucher_status} to ${voucher.voucher_status}`;
          }

          await this.auditService.logAction(userId, 'UPDATE', 'VOUCHER', voucher.id, details);

          return voucher;
        });
    } catch (error) {
      console.error('Prisma Transaction Error (Update):', error);
      throw new InternalServerErrorException('Failed to update voucher');
    }
  }

  async remove(id: string, userId: string) {
    const voucher = await this.prisma.tb_voucher.update({
      where: { id },
      data: { is_deleted: true, deleted_by: userId, deleted_at: new Date() }
    });
    await this.auditService.logAction(userId, 'DELETE', 'VOUCHER', id, 'Deleted/Cancelled Voucher');
    return voucher;
  }

  async generatePdf(id: string): Promise<Buffer> {
    const voucher = await this.findOne(id);
    const settings = await this.prisma.tb_system_settings.findFirst() || {};

    // Public URL that the QR code points to
    const baseUrl = process.env.FRONTEND_URL || 'https://mm-voucher-delta.vercel.app';
    const publicUrl = `${baseUrl}/api/vouchers/${id}/pdf`;
    const qrCodeBase64 = await QRCode.toDataURL(publicUrl, { margin: 1 });

    const htmlContent = generateVoucherHtml(voucher, settings, qrCodeBase64);

    const options = { format: 'A4', printBackground: true };
    const file = { content: htmlContent };

    return await html_to_pdf.generatePdf(file, options);
  }

  async generateMobile(id: string): Promise<string> {
    const voucher = await this.findOne(id);
    const settings = await this.prisma.tb_system_settings.findFirst() || {};

    const baseUrl = process.env.FRONTEND_URL || 'https://mm-voucher-delta.vercel.app';
    const publicUrl = `${baseUrl}/api/vouchers/${id}/mobile`;
    const qrCodeBase64 = await QRCode.toDataURL(publicUrl, { margin: 1 });

    const { generateMobileVoucherHtml } = require('./voucher-mobile.template');
    const htmlContent = generateMobileVoucherHtml(voucher, settings, qrCodeBase64);

    return htmlContent;
  }
}

