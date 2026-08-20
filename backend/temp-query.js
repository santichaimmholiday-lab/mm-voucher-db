const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ datasources: { db: { url: 'postgresql://postgres.xmbzjgsqiakdnmuhbmvc:MMHolidays_2026@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres' } } });
prisma.tb_system_settings.findFirst().then(data => {
  console.log({
    ...data,
    logo_image_path: data?.logo_image_path?.substring(0, 50) + '...',
    qr_code_path: data?.qr_code_path?.substring(0, 50) + '...'
  });
}).finally(() => prisma.$disconnect());
