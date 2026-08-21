import { Controller, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/permissions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Admin')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get('roles/:role')
  getRolePermissions(@Param('role') role: string) {
    return this.permissionsService.getRolePermissions(role);
  }

  @Patch('roles/:role')
  saveRolePermissions(@Param('role') role: string, @Body() matrix: Record<string, any>) {
    return this.permissionsService.saveRolePermissions(role, matrix);
  }
}
