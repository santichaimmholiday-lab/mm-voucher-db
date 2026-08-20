export interface VoucherHotel {
  hotel_hotel?: string;
  hotel_adderss?: string;
  hotel_telephone_no?: string;
  hotel_check_in?: string;
  hotel_check_out?: string;
  hotel_room_type?: string;
  hotel_no_of_room?: string;
  hotel_night?: string;
}

export interface VoucherTour {
  tour_pick_up_date?: string;
  tour_pick_up_time?: string;
  tour_room_no?: string;
  tour_mobile_number?: string;
  tour_lunch?: string;
  tour_dinner?: string;
}

export interface Voucher {
  id: string;
  voucher_no: string;
  voucher_issue_date: string;
  voucher_guest_name: string;
  voucher_company: string;
  voucher_status: string;
  is_deleted: boolean;
  hotel?: VoucherHotel;
  tour?: VoucherTour;
}

export interface CreateVoucherPayload {
  voucher_issue_date: string;
  voucher_guest_name: string;
  voucher_pax_no?: string;
  voucher_adult?: string;
  voucher_child?: string;
  voucher_contact_number?: string;
  voucher_email_id?: string;
  voucher_tour_details?: string;
  voucher_company: string;
  hotel?: VoucherHotel;
  tour?: VoucherTour;
}
