"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var client_2 = require("@libsql/client");
var adapter_libsql_1 = require("@prisma/adapter-libsql");
var libsql = (0, client_2.createClient)({
    url: 'file:./dev.db',
});
var adapter = new adapter_libsql_1.PrismaLibSql(libsql);
var prisma = new client_1.PrismaClient({ adapter: adapter });
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var hotelType, attrType, tourType, hotel1, attr1, tour1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Seeding database with dynamic voucher setup...');
                    // 1. Settings
                    return [4 /*yield*/, prisma.tb_system_settings.create({
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
                                condition_hotel: "- Check-in time is after 15:00 hours and check-out time is 12:00 hours.\n- Early check-in at 09:00 Hrs. is a half-day charge full day charge applies before 09:00 Hrs. room only (subject to availability). \nAdditional breakfast net per pax as per HOTEL\nLate check out chargeable after 12.00 Noon as per the Hotel rules. \n- All cancellations should be at least 72 hours prior to arrival. In the event of late cancellation, no show on the day of arrival, a first-night room charge is applicable (unless otherwise stated in remarks)",
                                condition_tour: "\u2756 Please be on time, otherwise you will miss the services.\n\u2756 The exact pick-up time for tour & transfer will be reconfirmed by the guide locally.\n\u2756 Return time to hotel is subject to change (depend on the traffic & weather conditions)"
                            }
                        })];
                case 1:
                    // 1. Settings
                    _a.sent();
                    return [4 /*yield*/, prisma.tb_master_locatype.create({ data: { locatype_code: 'HOTEL', locatype_name: 'Hotel' } })];
                case 2:
                    hotelType = _a.sent();
                    return [4 /*yield*/, prisma.tb_master_locatype.create({ data: { locatype_code: 'ATTRACTION', locatype_name: 'Local Attraction' } })];
                case 3:
                    attrType = _a.sent();
                    return [4 /*yield*/, prisma.tb_master_locatype.create({ data: { locatype_code: 'TOUR', locatype_name: 'Tour' } })];
                case 4:
                    tourType = _a.sent();
                    return [4 /*yield*/, prisma.tb_master_location.create({ data: { location_code: 'HTL-01', location_name: 'Grand Palace Hotel', location_address: '123 Sukhumvit, BKK', location_locatype: hotelType.id } })];
                case 5:
                    hotel1 = _a.sent();
                    return [4 /*yield*/, prisma.tb_master_location.create({ data: { location_code: 'ATT-01', location_name: 'Safari World Bangkok', location_address: 'Minburi, BKK', location_locatype: attrType.id } })];
                case 6:
                    attr1 = _a.sent();
                    return [4 /*yield*/, prisma.tb_master_location.create({ data: { location_code: 'TUR-01', location_name: 'Ayutthaya Full Day Tour', location_address: 'Ayutthaya', location_locatype: tourType.id } })];
                case 7:
                    tour1 = _a.sent();
                    // 4. Customers
                    return [4 /*yield*/, prisma.tb_customer.createMany({
                            data: [
                                { cus_nickname: 'Agoda', cus_name: 'Agoda Services Co.,Ltd.', cus_tel: '02-123-4567' },
                                { cus_nickname: 'Booking', cus_name: 'Booking.com (Thailand)', cus_tel: '02-987-6543' }
                            ],
                        })];
                case 8:
                    // 4. Customers
                    _a.sent();
                    // 5. Vouchers (One of each type)
                    // 5.1 Hotel Voucher
                    return [4 /*yield*/, prisma.tb_voucher.create({
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
                        })];
                case 9:
                    // 5. Vouchers (One of each type)
                    // 5.1 Hotel Voucher
                    _a.sent();
                    // 5.2 Attraction Voucher
                    return [4 /*yield*/, prisma.tb_voucher.create({
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
                        })];
                case 10:
                    // 5.2 Attraction Voucher
                    _a.sent();
                    // 5.3 Tour Voucher
                    return [4 /*yield*/, prisma.tb_voucher.create({
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
                        })];
                case 11:
                    // 5.3 Tour Voucher
                    _a.sent();
                    console.log('Seeding complete!');
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(console.error).finally(function () { return prisma.$disconnect(); });
