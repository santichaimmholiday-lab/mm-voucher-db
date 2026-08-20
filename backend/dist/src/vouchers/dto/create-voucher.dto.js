"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateVoucherSchema = exports.CreateVoucherTourSchema = exports.CreateVoucherHotelSchema = void 0;
const zod_1 = require("zod");
exports.CreateVoucherHotelSchema = zod_1.z.object({
    hotel_hotel: zod_1.z.string().optional(),
    hotel_adderss: zod_1.z.string().optional(),
    hotel_telephone_no: zod_1.z.string().optional(),
    hotel_fax: zod_1.z.string().optional(),
    hotel_check_in: zod_1.z.string().optional(),
    hotel_check_out: zod_1.z.string().optional(),
    hotel_room_type: zod_1.z.string().optional(),
    hotel_no_of_room: zod_1.z.string().optional(),
    hotel_night: zod_1.z.string().optional(),
    hotel_bed: zod_1.z.string().optional(),
    hotel_bed_single: zod_1.z.string().optional(),
    hotel_bed_double: zod_1.z.string().optional(),
    hotel_bed_triple: zod_1.z.string().optional(),
    hotel_bed_abf: zod_1.z.string().optional(),
    hotel_bed_no_abf: zod_1.z.string().optional(),
    hotel_remark: zod_1.z.string().optional(),
});
exports.CreateVoucherTourSchema = zod_1.z.object({
    tour_pick_up_date: zod_1.z.string().optional(),
    tour_pick_up_time: zod_1.z.string().optional(),
    tour_pick_up_date_at: zod_1.z.string().optional(),
    tour_droping_up_at: zod_1.z.string().optional(),
    tour_room_no: zod_1.z.string().optional(),
    tour_mobile_number: zod_1.z.string().optional(),
    tour_floating_market: zod_1.z.string().optional(),
    tour_river_kwai: zod_1.z.string().optional(),
    tour_ayutthaya: zod_1.z.string().optional(),
    tour_siam_niramit: zod_1.z.string().optional(),
    tour_dinner_cruise: zod_1.z.string().optional(),
    tour_safari_world: zod_1.z.string().optional(),
    tour_dream_world: zod_1.z.string().optional(),
    tour_lunch: zod_1.z.string().optional(),
    tour_dinner: zod_1.z.string().optional(),
});
exports.CreateVoucherSchema = zod_1.z.object({
    voucher_issue_date: zod_1.z.string(),
    voucher_guest_name: zod_1.z.string().min(1, 'Guest name is required'),
    voucher_pax_no: zod_1.z.string().optional(),
    voucher_adult: zod_1.z.string().optional(),
    voucher_child: zod_1.z.string().optional(),
    voucher_contact_number: zod_1.z.string().optional(),
    voucher_email_id: zod_1.z.string().optional(),
    voucher_tour_details: zod_1.z.string().optional(),
    voucher_company: zod_1.z.string().min(1, 'Company name is required'),
    hotel: exports.CreateVoucherHotelSchema.optional(),
    tour: exports.CreateVoucherTourSchema.optional(),
});
//# sourceMappingURL=create-voucher.dto.js.map