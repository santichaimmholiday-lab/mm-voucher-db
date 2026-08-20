import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.tb_user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        created_at: true,
      }
    });
    return users;
  }

  async create(data: any) {
    const existing = await this.prisma.tb_user.findFirst({
      where: { OR: [{ email: data.email }, { username: data.username }] }
    });
    if (existing) {
      throw new BadRequestException('User with this email or username already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.tb_user.create({
      data: {
        email: data.email,
        username: data.username,
        role: data.role,
        password: hashedPassword,
      },
      select: { id: true, email: true, username: true, role: true }
    });
  }

  async update(id: string, data: any) {
    const updateData: any = { ...data };
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }
    
    return this.prisma.tb_user.update({
      where: { id },
      data: updateData,
      select: { id: true, email: true, username: true, role: true }
    });
  }

  async remove(id: string) {
    return this.prisma.tb_user.delete({
      where: { id }
    });
  }

  async changePassword(userId: string, oldPass: string, newPass: string) {
    if (userId.startsWith('master-')) {
      throw new BadRequestException('Master account password cannot be changed here.');
    }

    const user = await this.prisma.tb_user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found');

    const isValid = await bcrypt.compare(oldPass, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid old password');

    const hashedNew = await bcrypt.hash(newPass, 10);
    await this.prisma.tb_user.update({
      where: { id: userId },
      data: { password: hashedNew }
    });
    
    return { success: true };
  }
}
