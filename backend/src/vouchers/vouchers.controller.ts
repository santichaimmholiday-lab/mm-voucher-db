import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res, Query } from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import type { Response } from 'express';

@Controller('api/vouchers')
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  @Get('dashboard-stats')
  getDashboardStats() {
    return this.vouchersService.getDashboardStats();
  }

  @Post()
  create(@Body() createDto: any, @Req() req: any) {
    return this.vouchersService.create(createDto, 'user123');
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('advanced') advanced?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.vouchersService.findAll(pageNum, limitNum, search, advanced);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vouchersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: any, @Req() req: any) {
    return this.vouchersService.update(id, updateDto, 'user123');
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.vouchersService.remove(id, 'user123');
  }

  @Get(':id/pdf')
  async generatePdf(@Param('id') id: string, @Res() res: Response) {
    const pdfBuffer = await this.vouchersService.generatePdf(id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="voucher-${id}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });
    res.end(pdfBuffer);
  }
}
