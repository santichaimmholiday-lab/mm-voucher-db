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
exports.MasterLocatypesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MasterLocatypesService = class MasterLocatypesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createDto, userId, ipAddress) {
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
            throw new common_1.ConflictException(`Locatype with code ${createDto.locatype_code} or name ${createDto.locatype_name} already exists.`);
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
    async findOne(id) {
        const locatype = await this.prisma.tb_master_locatype.findFirst({
            where: { id, is_deleted: false },
        });
        if (!locatype)
            throw new common_1.NotFoundException('Locatype not found');
        return locatype;
    }
    async update(id, updateDto, userId, ipAddress) {
        await this.findOne(id);
        return this.prisma.tb_master_locatype.update({
            where: { id },
            data: {
                ...updateDto,
                updated_by: userId,
                updated_ip: ipAddress,
            },
        });
    }
    async remove(id, userId, ipAddress) {
        await this.findOne(id);
        const inUse = await this.prisma.tb_master_location.findFirst({
            where: { location_locatype: id, is_deleted: false }
        });
        if (inUse) {
            throw new common_1.ConflictException('Cannot delete Locatype because it is currently assigned to one or more Master Locations.');
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
};
exports.MasterLocatypesService = MasterLocatypesService;
exports.MasterLocatypesService = MasterLocatypesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MasterLocatypesService);
//# sourceMappingURL=master-locatypes.service.js.map