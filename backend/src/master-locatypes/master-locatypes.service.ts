import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMasterLocatypeDto, UpdateMasterLocatypeDto } from './dto/create-master-locatype.dto';

@Injectable()
export class MasterLocatypesService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateMasterLocatypeDto, userId: string, ipAddress: string) {
    // BR-LOCTYPE-001: Duplicate Check
    const existing = await this.prisma.tb_master_locatype.findFirst({
      where: {
        OR: [
          { locatype_code: createDto.locatype_code },
          { locatype_name: createDto.locatype_name },
        ],
        is_deleted: false,
      },
    });

    if (existing) {
      throw new ConflictException(`Locatype with code ${createDto.locatype_code} or name ${createDto.locatype_name} already exists.`);
    }

    return this.prisma.tb_master_locatype.create({
      data: {
        ...createDto,
        created_by: userId,
        created_ip: ipAddress,
        is_deleted: false,
      },
    });
  }

  async findAll() {
    return this.prisma.tb_master_locatype.findMany({
      where: { is_deleted: false },
      orderBy: { locatype_name: 'asc' },
    });
  }

  async findOne(id: string) {
    const locatype = await this.prisma.tb_master_locatype.findFirst({
      where: { id, is_deleted: false },
    });
    if (!locatype) throw new NotFoundException('Locatype not found');
    return locatype;
  }

  async update(id: string, updateDto: UpdateMasterLocatypeDto, userId: string, ipAddress: string) {
    await this.findOne(id); // Check exists
    return this.prisma.tb_master_locatype.update({
      where: { id },
      data: {
        ...updateDto,
        updated_by: userId,
        updated_ip: ipAddress,
      },
    });
  }

  async remove(id: string, userId: string, ipAddress: string) {
    // BR-LOCTYPE-002: Soft Delete
    await this.findOne(id); // Check exists
    
    // Additional Check: Ensure no Master Locations are using this Locatype
    const inUse = await this.prisma.tb_master_location.findFirst({
      where: { location_locatype: id, is_deleted: false }
    });
    if (inUse) {
      throw new ConflictException('Cannot delete Locatype because it is currently assigned to one or more Master Locations.');
    }

    return this.prisma.tb_master_locatype.update({
      where: { id },
      data: {
        is_deleted: true,
        deleted_by: userId,
        deleted_ip: ipAddress,
        deleted_at: new Date(),
      },
    });
  }
}
