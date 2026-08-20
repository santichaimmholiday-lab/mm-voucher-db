import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings() {
    const settings = await this.prisma.tb_system_settings.findFirst();
    return settings || {};
  }

  async updateSettings(data: any) {
    const existing = await this.prisma.tb_system_settings.findFirst();
    if (existing) {
      return this.prisma.tb_system_settings.update({
        where: { id: existing.id },
        data
      });
    } else {
      return this.prisma.tb_system_settings.create({
        data
      });
    }
  }
}
