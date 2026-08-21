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
exports.PermissionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PermissionsService = class PermissionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getRolePermissions(role) {
        const records = await this.prisma.tb_role_permission.findMany({
            where: { role }
        });
        const matrix = {};
        for (const r of records) {
            matrix[r.module] = {
                read: r.can_read,
                add: r.can_add,
                edit: r.can_edit,
                delete: r.can_delete,
                printx: r.can_printx,
                confirm: r.can_confirm,
                upload: r.can_upload
            };
        }
        return matrix;
    }
    async saveRolePermissions(role, matrix) {
        const modules = Object.keys(matrix);
        await this.prisma.$transaction(modules.map(mod => {
            const perms = matrix[mod];
            return this.prisma.tb_role_permission.upsert({
                where: {
                    role_module: { role, module: mod }
                },
                update: {
                    can_read: !!perms.read,
                    can_add: !!perms.add,
                    can_edit: !!perms.edit,
                    can_delete: !!perms.delete,
                    can_printx: !!perms.printx,
                    can_confirm: !!perms.confirm,
                    can_upload: !!perms.upload,
                },
                create: {
                    role,
                    module: mod,
                    can_read: !!perms.read,
                    can_add: !!perms.add,
                    can_edit: !!perms.edit,
                    can_delete: !!perms.delete,
                    can_printx: !!perms.printx,
                    can_confirm: !!perms.confirm,
                    can_upload: !!perms.upload,
                }
            });
        }));
        return { success: true };
    }
};
exports.PermissionsService = PermissionsService;
exports.PermissionsService = PermissionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PermissionsService);
//# sourceMappingURL=permissions.service.js.map