import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({
  url: 'file:./dev.db',
});
const prisma = new PrismaClient({ adapter });

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
