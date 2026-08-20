"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    datasourceUrl: process.env.DIRECT_URL
});
async function main() {
    const locatypes = [
        { locatype_code: 'HOTEL', locatype_name: 'Hotel / Resort', locatype_desc: 'Accommodations' },
        { locatype_code: 'ATTRACTION', locatype_name: 'Local Attraction', locatype_desc: 'Theme parks, museums' },
        { locatype_code: 'TOUR', locatype_name: 'Sharing Tour', locatype_desc: 'Group tours' },
        { locatype_code: 'ROOM_TYPE', locatype_name: 'Room Type', locatype_desc: 'Standard, Deluxe, etc.' },
    ];
    for (const type of locatypes) {
        const existing = await prisma.tb_master_locatype.findUnique({
            where: { locatype_code: type.locatype_code },
        });
        if (!existing) {
            await prisma.tb_master_locatype.create({ data: type });
            console.log(`Created locatype: ${type.locatype_code}`);
        }
        else {
            console.log(`Locatype already exists: ${type.locatype_code}`);
        }
    }
    const roomTypes = [
        'Standard Room', 'Superior Room', 'Deluxe Room',
        'Executive Suite', 'Family Suite', 'Presidential Suite',
        'Studio', '1-Bedroom Apartment', 'Villa'
    ];
    for (const name of roomTypes) {
        const existing = await prisma.tb_master_location.findFirst({
            where: { location_name: name, locatype_code: 'ROOM_TYPE' }
        });
        if (!existing) {
            await prisma.tb_master_location.create({
                data: {
                    location_code: name.substring(0, 3).toUpperCase() + Math.floor(Math.random() * 100),
                    location_name: name,
                    locatype_code: 'ROOM_TYPE'
                }
            });
            console.log(`Created room type: ${name}`);
        }
        else {
            console.log(`Room type already exists: ${name}`);
        }
    }
}
main().catch(console.error).finally(() => prisma.$disconnect());
//# sourceMappingURL=temp-seed.js.map