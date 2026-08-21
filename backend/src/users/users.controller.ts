import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Req() req: any) {
    if (req.user.role?.toLowerCase() !== 'admin') throw new UnauthorizedException('Admin only');
    return this.usersService.findAll();
  }

  @Post()
  create(@Body() createDto: any, @Req() req: any) {
    if (req.user.role?.toLowerCase() !== 'admin') throw new UnauthorizedException('Admin only');
    return this.usersService.create(createDto);
  }

  @Patch('change-password')
  changePassword(@Body() body: any, @Req() req: any) {
    return this.usersService.changePassword(req.user.sub, body.oldPassword, body.newPassword);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: any, @Req() req: any) {
    if (req.user.role?.toLowerCase() !== 'admin') throw new UnauthorizedException('Admin only');
    return this.usersService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    if (req.user.role?.toLowerCase() !== 'admin') throw new UnauthorizedException('Admin only');
    const userId = req.user.sub || req.user.id || 'unknown';
    return this.usersService.remove(id, userId);
  }
}
