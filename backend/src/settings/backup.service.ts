import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as ExcelJS from 'exceljs';

@Injectable()
export class BackupService {
  constructor(private prisma: PrismaService) {}

  async generateExcelBackup(res: any) {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'MM Holiday System';
    workbook.created = new Date();

    // Helper to format worksheets
    const addSheet = (name: string, data: any[]) => {
      const sheet = workbook.addWorksheet(name);
      if (data.length > 0) {
        const columns = Object.keys(data[0]).map(key => ({
          header: key,
          key: key,
          width: 20
        }));
        sheet.columns = columns;
        
        // Add rows
        data.forEach(item => {
          // Convert objects/dates to strings if needed
          const formattedItem: any = {};
          for (const key in item) {
             if (item[key] instanceof Date) {
                 formattedItem[key] = item[key].toISOString();
             } else if (typeof item[key] === 'object' && item[key] !== null) {
                 formattedItem[key] = JSON.stringify(item[key]);
             } else {
                 formattedItem[key] = item[key];
             }
          }
          sheet.addRow(formattedItem);
        });

        // Style headers
        sheet.getRow(1).font = { bold: true };
      }
    };

    // 1. Users
    const users = await this.prisma.tb_user.findMany({ where: { is_deleted: false } });
    addSheet('Users', users);

    // 2. Customers
    const customers = await this.prisma.tb_customer.findMany({ where: { is_deleted: false } });
    addSheet('Customers', customers);

    // 3. Vouchers
    const vouchers = await this.prisma.tb_voucher.findMany({ where: { is_deleted: false } });
    addSheet('Vouchers', vouchers);

    // 4. Locations
    const locations = await this.prisma.tb_master_location.findMany();
    addSheet('Locations', locations);

    // 5. Location Types
    const locatypes = await this.prisma.tb_master_locatype.findMany();
    addSheet('Location Types', locatypes);

    // 6. Role Permissions
    const permissions = await this.prisma.tb_role_permission.findMany();
    addSheet('Role Permissions', permissions);

    // Write to Response
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=' + 'mm-holiday-backup-' + new Date().toISOString().split('T')[0] + '.xlsx');
    
    await workbook.xlsx.write(res);
    res.end();
  }
}
