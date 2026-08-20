import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { PrismaService } from './src/prisma/prisma.service';

async function seedRoomTypes() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);

  console.log('Seeding ROOM_TYPE...');

  // 1. Create or find Locatype
  let roomTypeLoca = await prisma.tb_master_locatype.findUnique({
    where: { locatype_code: 'ROOM_TYPE' }
  });

  if (!roomTypeLoca) {
    roomTypeLoca = await prisma.tb_master_locatype.create({
      data: {
        locatype_code: 'ROOM_TYPE',
        locatype_name: 'Room Type',
      }
    });
    console.log('Created ROOM_TYPE locatype');
  } else {
    console.log('ROOM_TYPE locatype already exists');
  }

  // 2. Seed common room types
  const commonRooms = [
    { code: 'RT-STD', name: 'Standard Room' },
    { code: 'RT-SUP', name: 'Superior Room' },
    { code: 'RT-DLX', name: 'Deluxe Room' },
    { code: 'RT-DLXD', name: 'Deluxe Double' },
    { code: 'RT-DLXT', name: 'Deluxe Twin' },
    { code: 'RT-EXEC', name: 'Executive Room' },
    { code: 'RT-STE', name: 'Suite' },
    { code: 'RT-FMLY', name: 'Family Room' },
    { code: 'RT-VIL', name: 'Villa' },
  ];

  for (const rt of commonRooms) {
    const exists = await prisma.tb_master_location.findFirst({
      where: { location_code: rt.code }
    });
    if (!exists) {
      await prisma.tb_master_location.create({
        data: {
          location_code: rt.code,
          location_name: rt.name,
          location_locatype: roomTypeLoca.id
        }
      });
      console.log(`Created room type: ${rt.name}`);
    }
  }

  console.log('Done seeding room types!');
  await app.close();
}

seedRoomTypes().catch(console.error);
