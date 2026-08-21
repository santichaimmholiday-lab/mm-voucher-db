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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackupService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const ExcelJS = __importStar(require("exceljs"));
let BackupService = class BackupService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateExcelBackup(res) {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'MM Holiday System';
        workbook.created = new Date();
        const addSheet = (name, data) => {
            const sheet = workbook.addWorksheet(name);
            if (data.length > 0) {
                const columns = Object.keys(data[0]).map(key => ({
                    header: key,
                    key: key,
                    width: 20
                }));
                sheet.columns = columns;
                data.forEach(item => {
                    const formattedItem = {};
                    for (const key in item) {
                        if (item[key] instanceof Date) {
                            formattedItem[key] = item[key].toISOString();
                        }
                        else if (typeof item[key] === 'object' && item[key] !== null) {
                            formattedItem[key] = JSON.stringify(item[key]);
                        }
                        else {
                            formattedItem[key] = item[key];
                        }
                    }
                    sheet.addRow(formattedItem);
                });
                sheet.getRow(1).font = { bold: true };
            }
        };
        const users = await this.prisma.tb_user.findMany({ where: { is_deleted: false } });
        addSheet('Users', users);
        const customers = await this.prisma.tb_customer.findMany({ where: { is_deleted: false } });
        addSheet('Customers', customers);
        const vouchers = await this.prisma.tb_voucher.findMany({ where: { is_deleted: false } });
        addSheet('Vouchers', vouchers);
        const locations = await this.prisma.tb_master_location.findMany();
        addSheet('Locations', locations);
        const locatypes = await this.prisma.tb_master_locatype.findMany();
        addSheet('Location Types', locatypes);
        const permissions = await this.prisma.tb_role_permission.findMany();
        addSheet('Role Permissions', permissions);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=' + 'mm-holiday-backup-' + new Date().toISOString().split('T')[0] + '.xlsx');
        await workbook.xlsx.write(res);
        res.end();
    }
};
exports.BackupService = BackupService;
exports.BackupService = BackupService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BackupService);
//# sourceMappingURL=backup.service.js.map