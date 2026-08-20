"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
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
    async create(data) {
        const existing = await this.prisma.tb_user.findFirst({
            where: { OR: [{ email: data.email }, { username: data.username }] }
        });
        if (existing) {
            throw new common_1.BadRequestException('User with this email or username already exists');
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
    async update(id, data) {
        const updateData = { ...data };
        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 10);
        }
        return this.prisma.tb_user.update({
            where: { id },
            data: updateData,
            select: { id: true, email: true, username: true, role: true }
        });
    }
    async remove(id) {
        return this.prisma.tb_user.delete({
            where: { id }
        });
    }
    async changePassword(userId, oldPass, newPass) {
        if (userId.startsWith('master-')) {
            throw new common_1.BadRequestException('Master account password cannot be changed here.');
        }
        const user = await this.prisma.tb_user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.BadRequestException('User not found');
        const isValid = await bcrypt.compare(oldPass, user.password);
        if (!isValid)
            throw new common_1.UnauthorizedException('Invalid old password');
        const hashedNew = await bcrypt.hash(newPass, 10);
        await this.prisma.tb_user.update({
            where: { id: userId },
            data: { password: hashedNew }
        });
        return { success: true };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map