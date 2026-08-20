import { z } from 'zod';

export const CreateVoucherHotelSchema = z.object({
  hotel_hotel: z.string().optional(),
  hotel_adderss: z.string().optional(),
  hotel_telephone_no: z.string().optional(),
  hotel_fax: z.string().optional(),
  hotel_check_in: z.string().optional(),
  hotel_check_out: z.string().optional(),
  hotel_room_type: z.string().optional(),
  hotel_no_of_room: z.string().optional(),
  hotel_night: z.string().optional(),
  hotel_bed: z.string().optional(),
  hotel_bed_single: z.string().optional(),
  hotel_bed_double: z.string().optional(),
  hotel_bed_triple: z.string().optional(),
  hotel_bed_abf: z.string().optional(),
  hotel_bed_no_abf: z.string().optional(),
  hotel_remark: z.string().optional(),
});

export const CreateVoucherTourSchema = z.object({
  tour_pick_up_date: z.string().optional(),
  tour_pick_up_time: z.string().optional(),
  tour_pick_up_date_at: z.string().optional(),
  tour_droping_up_at: z.string().optional(),
  tour_room_no: z.string().optional(),
  tour_mobile_number: z.string().optional(),
  tour_floating_market: z.string().optional(),
  tour_river_kwai: z.string().optional(),
  tour_ayutthaya: z.string().optional(),
  tour_siam_niramit: z.string().optional(),
  tour_dinner_cruise: z.string().optional(),
  tour_safari_world: z.string().optional(),
  tour_dream_world: z.string().optional(),
  tour_lunch: z.string().optional(),
  tour_dinner: z.string().optional(),
});

export const CreateVoucherSchema = z.object({
  voucher_issue_date: z.string(), // YYYY-MM-DD format
  voucher_guest_name: z.string().min(1, 'Guest name is required'),
  voucher_pax_no: z.string().optional(),
  voucher_adult: z.string().optional(),
  voucher_child: z.string().optional(),
  voucher_contact_number: z.string().optional(),
  voucher_email_id: z.string().optional(),
  voucher_tour_details: z.string().optional(),
  voucher_company: z.string().min(1, 'Company name is required'),
  hotel: CreateVoucherHotelSchema.optional(),
  tour: CreateVoucherTourSchema.optional(),
});

export type CreateVoucherDto = z.infer<typeof CreateVoucherSchema>;
