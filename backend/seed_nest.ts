import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { PrismaService } from './src/prisma/prisma.service';

async function bootstrap() {
  console.log('Seeding database with dynamic voucher setup via NestJS...');
  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);

  // 1. Settings
  await prisma.tb_system_settings.create({
    data: {
      company_name: 'MM HOLIDAYS CO., LTD.',
      company_name_th: 'บริษัท เอ็มเอ็ม ฮอลิเดย์ จำกัด',
      company_address: '256/4 Silom Road, Suriyawong, Bangrak, Bangkok 10500 Thailand',
      company_tel: '+662-635-6944-5',
      company_email: 'info@mmholidays.com, mmholidaysbkk@gmail.com',
      company_web: 'www.mmholidays.com',
      tat_license: 'TAT No. 14/00733',
      logo_image_path: null,
      qr_code_path: null,
      condition_booking: 'CONDITION OF BOOKING: NON-REFUNDABLE',
      condition_hotel: `- Check-in time is after 15:00 hours and check-out time is 12:00 hours.\n- Early check-in at 09:00 Hrs. is a half-day charge full day charge applies before 09:00 Hrs. room only (subject to availability). \nAdditional breakfast net per pax as per HOTEL\nLate check out chargeable after 12.00 Noon as per the Hotel rules. \n- All cancellations should be at least 72 hours prior to arrival. In the event of late cancellation, no show on the day of arrival, a first-night room charge is applicable (unless otherwise stated in remarks)`,
      condition_tour: `❖ Please be on time, otherwise you will miss the services.\n❖ The exact pick-up time for tour & transfer will be reconfirmed by the guide locally.\n❖ Return time to hotel is subject to change (depend on the traffic & weather conditions)`
    }
  });

  // 2. Master Locatypes
  const hotelType = await prisma.tb_master_locatype.create({ data: { locatype_code: 'HOTEL', locatype_name: 'Hotel' } });
  const attrType = await prisma.tb_master_locatype.create({ data: { locatype_code: 'ATTRACTION', locatype_name: 'Local Attraction' } });
  const tourType = await prisma.tb_master_locatype.create({ data: { locatype_code: 'TOUR', locatype_name: 'Tour' } });

  // 3. Master Locations
  const hotel1 = await prisma.tb_master_location.create({ data: { location_code: 'HTL-01', location_name: 'Grand Palace Hotel', location_address: '123 Sukhumvit, BKK', location_locatype: hotelType.id } });
  const attr1 = await prisma.tb_master_location.create({ data: { location_code: 'ATT-01', location_name: 'Safari World Bangkok', location_address: 'Minburi, BKK', location_locatype: attrType.id } });
  const tour1 = await prisma.tb_master_location.create({ data: { location_code: 'TUR-01', location_name: 'Ayutthaya Full Day Tour', location_address: 'Ayutthaya', location_locatype: tourType.id } });

  // 4. Customers
  await prisma.tb_customer.createMany({
    data: [
      { cus_nickname: 'Agoda', cus_name: 'Agoda Services Co.,Ltd.', cus_tel: '02-123-4567' },
      { cus_nickname: 'Booking', cus_name: 'Booking.com (Thailand)', cus_tel: '02-987-6543' }
    ],
  });

  // 5. Vouchers (One of each type)
  // 5.1 Hotel Voucher
  await prisma.tb_voucher.create({
    data: {
      voucher_no: 'MM26080001',
      voucher_issue_date: new Date('2026-08-19T00:00:00Z'),
      voucher_type: 'HOTEL',
      voucher_status: 'Confirmed',
      voucher_company: 'Agoda Services Co.,Ltd.',
      voucher_guest_name: 'Mr. John Wick',
      guest_mobile: '0812345678',
      pax_adult: 2,
      pax_child: 1,
      child_age: '5 yrs',
      pax_infant: 0,
      
      hotel_id: hotel1.id,
      check_in_date: new Date('2026-09-01T15:00:00Z'),
      check_out_date: new Date('2026-09-03T12:00:00Z'),
      nights: 2,
      rooms: 1,
      room_type: 'Deluxe Double',
      conf_no: 'AGD-998877',
      payment_by: 'Agent',
      remarks: 'Honeymoon setup please',
      conf_by: 'Reservation Dept.'
    }
  });

  // 5.2 Attraction Voucher
  await prisma.tb_voucher.create({
    data: {
      voucher_no: 'MM26080002',
      voucher_issue_date: new Date('2026-08-19T00:00:00Z'),
      voucher_type: 'LOCAL ATTRACTION',
      voucher_status: 'Waiting',
      voucher_company: 'Booking.com (Thailand)',
      voucher_guest_name: 'Ms. Sarah Connor',
      guest_mobile: '0898765432',
      pax_adult: 4,
      pax_child: 0,
      pax_infant: 0,
      
      attraction_id: attr1.id,
      visit_date: new Date('2026-09-05T09:00:00Z'),
      person_count: 4,
      entrance_ticket: 'Full Park + Buffet Lunch',
      remarks: 'Vegetarian meal requested',
      conf_by: 'Sales Dept.'
    }
  });

  // 5.3 Tour Voucher
  await prisma.tb_voucher.create({
    data: {
      voucher_no: 'MM26080003',
      voucher_issue_date: new Date('2026-08-19T00:00:00Z'),
      voucher_type: 'SHARING TOUR',
      voucher_status: 'Confirmed',
      voucher_company: 'Direct Booking',
      voucher_guest_name: 'Mr. James Bond',
      guest_mobile: '007007007',
      pax_adult: 1,
      pax_child: 0,
      pax_infant: 0,
      
      tour_id: tour1.id,
      pickup_hotel_id: hotel1.id,
      pickup_time: '07:30 AM',
      visit_date: new Date('2026-09-10T08:00:00Z'),
      person_count: 1,
      remarks: 'VIP seating',
      conf_by: 'Tour Operator A'
    }
  });

  console.log('Seeding complete!');
  await app.close();
}

bootstrap().catch(err => {
  console.error(err);
  process.exit(1);
});
