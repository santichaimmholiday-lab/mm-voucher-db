"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterLocationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MasterLocationsService = class MasterLocationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createDto, userId, ipAddress) {
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
            throw new common_1.ConflictException(`Location Code ${createDto.location_code} or Name ${createDto.location_name} already exists.`);
        }
        return this.prisma.tb_master_location.create({
            data: {
                ...createDto,
                created_by: userId,
                is_deleted: false
            }
        });
    }
    async findAll() {
        return this.prisma.tb_master_location.findMany({
            where: { is_deleted: false },
            orderBy: { location_name: 'asc' }, include: { locatype: true }
        });
    }
    async findOne(id) {
        const location = await this.prisma.tb_master_location.findFirst({
            where: { id, is_deleted: false }
        });
        if (!location)
            throw new common_1.NotFoundException('Master location not found');
        return location;
    }
    async update(id, updateDto, userId, ipAddress) {
        await this.findOne(id);
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
                throw new common_1.ConflictException('Location Code or Name already exists.');
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
    async remove(id, userId, ipAddress) {
        await this.findOne(id);
        return this.prisma.tb_master_location.update({
            where: { id },
            data: {
                is_deleted: true,
                deleted_by: userId,
                deleted_at: new Date()
            }
        });
    }
};
exports.MasterLocationsService = MasterLocationsService;
exports.MasterLocationsService = MasterLocationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MasterLocationsService);
//# sourceMappingURL=master-locations.service.js.map