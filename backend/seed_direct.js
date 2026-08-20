const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient({
  datasourceUrl: 'postgresql://postgres.xmbzjgsqiakdnmuhbmvc:MMHolidays_2026@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true'
});

async function seed() {
  const users = [
    { username: 'admin', email: 'admin@mmholiday.com', role: 'Admin', password: 'password123' },
    { username: 'manager', email: 'manager@mmholiday.com', role: 'Manager', password: 'password123' },
    { username: 'staff', email: 'staff@mmholiday.com', role: 'User', password: 'password123' },
  ];

  for (const u of users) {
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
}

seed().catch(console.error).finally(() => prisma.$disconnect());
