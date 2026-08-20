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
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./src/app.module");
const prisma_service_1 = require("./src/prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
async function seedUsers() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const prisma = app.get(prisma_service_1.PrismaService);
    console.log('Seeding Users...');
    const users = [
        { username: 'admin', email: 'admin@mmholiday.com', role: 'Admin', password: 'password123' },
        { username: 'manager', email: 'manager@mmholiday.com', role: 'Manager', password: 'password123' },
        { username: 'staff', email: 'staff@mmholiday.com', role: 'User', password: 'password123' },
    ];
    for (const u of users) {
        const existing = await prisma.tb_user.findUnique({ where: { username: u.username } });
        if (!existing) {
            const hashedPassword = await bcrypt.hash(u.password, 10);
            await prisma.tb_user.create({
                data: {
                    username: u.username,
                    email: u.email,
                    role: u.role,
                    password: hashedPassword
                }
            });
            console.log(`Created user: ${u.username}`);
        }
        else {
            console.log(`User already exists: ${u.username}`);
        }
    }
    console.log('Done seeding users!');
    await app.close();
}
seedUsers().catch(console.error);
//# sourceMappingURL=seed_users.js.map