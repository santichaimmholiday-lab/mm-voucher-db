import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { MasterLocationsService } from './master-locations.service';
import type { CreateMasterLocationDto } from './dto/create-master-location.dto';
import type { UpdateMasterLocationDto } from './dto/update-master-location.dto';
// Mock definitions for Guards and Decorators that would be implemented
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@Controller('api/master-locations')
@UseGuards(JwtAuthGuard)
export class MasterLocationsController {
  constructor(private readonly masterLocationsService: MasterLocationsService) {}

  @Post()
  @RequirePermissions('Master_location', 'add')
  create(@Body() createDto: CreateMasterLocationDto, @Req() req: any) {
    const userId = req.user.id;
    const ipAddress = req.ip;
    return this.masterLocationsService.create(createDto, userId, ipAddress);
  }

  @Get()
  @RequirePermissions('Master_location', 'read')
  findAll() {
    return this.masterLocationsService.findAll();
  }

  @Get(':id')
  @RequirePermissions('Master_location', 'read')
  findOne(@Param('id') id: string) {
    return this.masterLocationsService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions('Master_location', 'edit')
  update(@Param('id') id: string, @Body() updateDto: UpdateMasterLocationDto, @Req() req: any) {
    const userId = req.user.id;
    const ipAddress = req.ip;
    return this.masterLocationsService.update(id, updateDto, userId, ipAddress);
  }

  @Delete(':id')
  @RequirePermissions('Master_location', 'delete')
  remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.id;
    const ipAddress = req.ip;
    return this.masterLocationsService.remove(id, userId, ipAddress);
  }
}
