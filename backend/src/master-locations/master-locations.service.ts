import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateMasterLocationDto } from './dto/create-master-location.dto';
import { UpdateMasterLocationDto } from './dto/update-master-location.dto';
// Prisma service is mocked here as a placeholder for the actual DB implementation
import { PrismaService } from '../prisma/prisma.service'; 

@Injectable()
export class MasterLocationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateMasterLocationDto, userId: string, ipAddress: string) {
    // BR-MAS-001: Duplicate Check
    const existing = await this.prisma.tb_master_location.findFirst({
      where: {
        OR: [
          { location_code: createDto.location_code },
          { location_name: createDto.location_name }
        ],
        is_deleted: false
      }
    });

    if (existing) {
      throw new ConflictException(`Location Code ${createDto.location_code} or Name ${createDto.location_name} already exists.`);
    }

    // BR-MAS-003: Audit Trail is handled by passing userId
    return this.prisma.tb_master_location.create({
      data: {
        ...createDto,
        created_by: userId,
        // In actual implementation, we might log IP to a separate audit table or keep it if requested
        is_deleted: false
      }
    });
  }

  async findAll() {
    // BR-MAS-002: Ignore soft-deleted records
    return this.prisma.tb_master_location.findMany({
      where: { is_deleted: false },
      orderBy: { location_name: 'asc' }, include: { locatype: true }
    });
  }

  async findOne(id: string) {
    const location = await this.prisma.tb_master_location.findFirst({
      where: { id, is_deleted: false }
    });
    
    if (!location) throw new NotFoundException('Master location not found');
    return location;
  }

  async update(id: string, updateDto: UpdateMasterLocationDto, userId: string, ipAddress: string) {
    await this.findOne(id); // Check existence

    // Check duplicate for edit if name/code is being changed
    if (updateDto.location_code || updateDto.location_name) {
      const existing = await this.prisma.tb_master_location.findFirst({
        where: {
          OR: [
            ...(updateDto.location_code ? [{ location_code: updateDto.location_code }] : []),
            ...(updateDto.location_name ? [{ location_name: updateDto.location_name }] : [])
          ],
          id: { not: id },
          is_deleted: false
        }
      });
      if (existing) {
        throw new ConflictException('Location Code or Name already exists.');
      }
    }

    return this.prisma.tb_master_location.update({
      where: { id },
      data: {
        ...updateDto,
        updated_by: userId,
        updated_at: new Date()
      }
    });
  }

  async remove(id: string, userId: string, ipAddress: string) {
    await this.findOne(id); // Check existence

    // BR-MAS-002: Soft Delete
    // BR-MAS-003: Audit trail on delete
    return this.prisma.tb_master_location.update({
      where: { id },
      data: {
        is_deleted: true,
        deleted_by: userId,
        deleted_at: new Date()
      }
    });
  }
}
