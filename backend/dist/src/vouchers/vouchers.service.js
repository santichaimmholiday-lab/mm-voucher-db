"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VouchersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const audit_service_1 = require("../audit/audit.service");
const QRCode = __importStar(require("qrcode"));
const html_pdf_node_1 = __importDefault(require("html-pdf-node"));
const voucher_pdf_template_1 = require("./voucher-pdf.template");
let VouchersService = class VouchersService {
    prisma;
    auditService;
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
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
    async generateVoucherNumber(issueDate) {
        const year = issueDate.substring(2, 4);
        const month = issueDate.substring(5, 7);
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
    async create(createDto, userId) {
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
                await this.auditService.logAction(userId, 'CREATE', 'VOUCHER', voucher.id, {
                    voucher_no: voucher.voucher_no,
                    voucher_type: voucher.voucher_type,
                    guest_name: voucher.voucher_guest_name
                });
                return voucher;
            });
        }
        catch (error) {
            console.error('Prisma Transaction Error:', error);
            throw new common_1.InternalServerErrorException('Failed to create composite voucher transaction');
        }
    }
    async findAll(page = 1, limit = 10, search, advanced) {
        const skip = (page - 1) * limit;
        const take = limit;
        let where = { is_deleted: false };
        if (search) {
            where.OR = [
                { voucher_no: { contains: search } },
                { voucher_guest_name: { contains: search } },
                { voucher_company: { contains: search } },
                { voucher_status: { contains: search } },
            ];
        }
        if (advanced) {
            try {
                const filters = JSON.parse(advanced);
                const advancedWhere = [];
                filters.forEach((f) => {
                    if (!f.field || !f.operator || !f.value)
                        return;
                    let condition = {};
                    if (f.operator === 'contains')
                        condition[f.field] = { contains: f.value };
                    else if (f.operator === 'startsWith')
                        condition[f.field] = { startsWith: f.value };
                    else if (f.operator === 'endsWith')
                        condition[f.field] = { endsWith: f.value };
                    else if (f.operator === 'equals')
                        condition[f.field] = { equals: f.value };
                    else if (f.operator === 'gt')
                        condition[f.field] = { gt: f.value };
                    else if (f.operator === 'lt')
                        condition[f.field] = { lt: f.value };
                    else if (f.operator === 'between' && f.valueTo) {
                        const isDate = f.field === 'voucher_issue_date' || f.field.includes('date');
                        if (isDate) {
                            const toDate = new Date(f.valueTo);
                            toDate.setHours(23, 59, 59, 999);
                            condition[f.field] = {
                                gte: new Date(f.value),
                                lte: toDate
                            };
                        }
                        else {
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
            }
            catch (e) {
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
    async findOne(id) {
        const voucher = await this.prisma.tb_voucher.findUnique({
            where: { id, is_deleted: false },
            include: {
                attraction: true,
                hotel: true,
                pickup_hotel: true,
                tour: true
            }
        });
        if (!voucher)
            throw new common_1.NotFoundException('Voucher not found');
        return voucher;
    }
    async getLogs(id) {
        return this.auditService.getEntityLogs(id);
    }
    async update(id, updateDto, userId) {
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
        }
        catch (error) {
            console.error('Prisma Transaction Error (Update):', error);
            throw new common_1.InternalServerErrorException('Failed to update voucher');
        }
    }
    async remove(id, userId) {
        const voucher = await this.prisma.tb_voucher.update({
            where: { id },
            data: { is_deleted: true, deleted_by: userId, deleted_at: new Date() }
        });
        await this.auditService.logAction(userId, 'DELETE', 'VOUCHER', id, 'Deleted/Cancelled Voucher');
        return voucher;
    }
    async generatePdf(id) {
        const voucher = await this.findOne(id);
        const settings = await this.prisma.tb_system_settings.findFirst() || {};
        const baseUrl = process.env.FRONTEND_URL || 'https://mm-voucher-delta.vercel.app';
        const publicUrl = `${baseUrl}/api/vouchers/${id}/pdf`;
        const qrCodeBase64 = await QRCode.toDataURL(publicUrl, { margin: 1 });
        const htmlContent = (0, voucher_pdf_template_1.generateVoucherHtml)(voucher, settings, qrCodeBase64);
        const options = { format: 'A4', printBackground: true };
        const file = { content: htmlContent };
        return await html_pdf_node_1.default.generatePdf(file, options);
    }
    async generateMobile(id) {
        const voucher = await this.findOne(id);
        const settings = await this.prisma.tb_system_settings.findFirst() || {};
        const baseUrl = process.env.FRONTEND_URL || 'https://mm-voucher-delta.vercel.app';
        const publicUrl = `${baseUrl}/api/vouchers/${id}/mobile`;
        const qrCodeBase64 = await QRCode.toDataURL(publicUrl, { margin: 1 });
        const { generateMobileVoucherHtml } = require('./voucher-mobile.template');
        const htmlContent = generateMobileVoucherHtml(voucher, settings, qrCodeBase64);
        return htmlContent;
    }
};
exports.VouchersService = VouchersService;
exports.VouchersService = VouchersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], VouchersService);
//# sourceMappingURL=vouchers.service.js.map