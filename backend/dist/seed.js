"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_libsql_1 = require("@prisma/adapter-libsql");
const adapter = new adapter_libsql_1.PrismaLibSql({
    url: 'file:./dev.db',
});
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    await prisma.tb_master_locatype.createMany({
        data: [
            { locatype_code: 'HOTEL', locatype_name: 'Hotel' },
            { locatype_code: 'TOUR', locatype_name: 'Tour' },
            { locatype_code: 'TRANSFER', locatype_name: 'Transfer' },
        ],
    });
    console.log('Seeded successfully!');
}
main().catch(console.error).finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map