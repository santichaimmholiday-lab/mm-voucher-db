import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller('api/health')
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async checkHealth() {
    // Query DB to keep Supabase awake
    const count = await this.prisma.tb_user.count();
    return { status: 'OK', timestamp: new Date(), db_awake: true, user_count: count };
  }
}
