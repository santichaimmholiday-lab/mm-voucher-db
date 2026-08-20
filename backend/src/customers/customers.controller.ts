import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { CustomersService } from './customers.service';
import type { CreateCustomerDto } from './dto/create-customer.dto';
import type { UpdateCustomerDto } from './dto/update-customer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/customers')
@UseGuards(JwtAuthGuard, RolesGuard)
// Legacy Code forced admin_check() inside the model. We enforce it via Guards.
@Roles('Admin') // Only Admin can access customers module based on legacy admin_check()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(@Body() createDto: CreateCustomerDto, @Req() req: any) {
    const userId = req.user.id;
    return this.customersService.create(createDto, userId);
  }

  @Get()
  findAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateCustomerDto, @Req() req: any) {
    const userId = req.user.id;
    return this.customersService.update(id, updateDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.id;
    return this.customersService.remove(id, userId);
  }
}
