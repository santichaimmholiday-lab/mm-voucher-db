import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from '../prisma/prisma.service'; // Mocked Prisma service

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateCustomerDto, userId: string) {
    // BR-CUS-001: Duplicate Check on cus_nickname
    const existing = await this.prisma.tb_customer.findFirst({
      where: {
        cus_nickname: createDto.cus_nickname,
        is_deleted: false,
      },
    });

    if (existing) {
      throw new ConflictException(`Customer ${createDto.cus_nickname} is duplicated!`);
    }

    return this.prisma.tb_customer.create({
      data: {
        ...createDto,
        created_by: userId,
        is_deleted: false,
      },
    });
  }

  async findAll() {
    return this.prisma.tb_customer.findMany({
      where: { is_deleted: false },
      orderBy: { cus_nickname: 'asc' }, // Match legacy order_by
    });
  }

  async findOne(id: string) {
    const customer = await this.prisma.tb_customer.findFirst({
      where: { id, is_deleted: false },
    });
    
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async update(id: string, updateDto: UpdateCustomerDto, userId: string) {
    await this.findOne(id); // Check existence

    // BR-CUS-001: Duplicate check for edit
    if (updateDto.cus_nickname) {
      const existing = await this.prisma.tb_customer.findFirst({
        where: {
          cus_nickname: updateDto.cus_nickname,
          id: { not: id },
          is_deleted: false,
        },
      });
      if (existing) {
        throw new ConflictException(`Customer nickname ${updateDto.cus_nickname} already exists.`);
      }
    }

    return this.prisma.tb_customer.update({
      where: { id },
      data: {
        ...updateDto,
        updated_by: userId,
        updated_at: new Date(),
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id);

    // BR-CUS-002: Soft Delete & Legacy Bug Fix
    // Legacy mistakenly updated "tb_users" here. We update "customers" table instead.
    return this.prisma.tb_customer.update({
      where: { id },
      data: {
        is_deleted: true,
        deleted_by: userId,
        deleted_at: new Date(),
      },
    });
  }
}
