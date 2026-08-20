import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { MasterLocatypesService } from './master-locatypes.service';
import { CreateMasterLocatypeDto, UpdateMasterLocatypeDto } from './dto/create-master-locatype.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('Master Locatypes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/master-locatypes')
export class MasterLocatypesController {
  constructor(private readonly masterLocatypesService: MasterLocatypesService) {}

  @Post()
  @RequirePermissions('MasterLocatype', 'add')
  create(@Body() createDto: CreateMasterLocatypeDto, @Req() req: any) {
    const userId = req.user['sub'];
    const ipAddress = req.ip;
    return this.masterLocatypesService.create(createDto, userId, ipAddress);
  }

  @Get()
  @RequirePermissions('MasterLocatype', 'view')
  findAll() {
    return this.masterLocatypesService.findAll();
  }

  @Get(':id')
  @RequirePermissions('MasterLocatype', 'view')
  findOne(@Param('id') id: string) {
    return this.masterLocatypesService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions('MasterLocatype', 'edit')
  update(@Param('id') id: string, @Body() updateDto: UpdateMasterLocatypeDto, @Req() req: any) {
    const userId = req.user['sub'];
    const ipAddress = req.ip;
    return this.masterLocatypesService.update(id, updateDto, userId, ipAddress);
  }

  @Delete(':id')
  @RequirePermissions('MasterLocatype', 'delete')
  remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user['sub'];
    const ipAddress = req.ip;
    return this.masterLocatypesService.remove(id, userId, ipAddress);
  }
}
