export interface MasterLocation {
  id: string;
  location_name: string;
  location_code: string;
  location_address?: string;
  locatype?: {
    locatype_code: string;
  };
}

export interface Voucher {
  id: string;
  voucher_no: string;
  voucher_issue_date: string;
  voucher_status: string;
  voucher_type: string;
  voucher_guest_name: string;
  voucher_company?: string;
  guest_mobile?: string;
  pax_adult: number;
  pax_child: number;
  child_age?: string;
  pax_infant: number;

  hotel_id?: string;
  check_in_date?: string;
  check_out_date?: string;
  nights?: number;
  rooms?: number;
  room_type?: string;
  breakfast?: string;

  attraction_id?: string;
  visit_date?: string;
  person_count?: number;
  entrance_ticket?: string;

  tour_id?: string;
  pickup_hotel_id?: string;
  pickup_location?: string;
  pickup_time?: string;

  conf_no?: string;
  payment_by?: string;
  remarks?: string;
  conf_by?: string;

  // Relations (Read only)
  hotel?: { location_name: string; location_address: string };
  attraction?: { location_name: string };
  tour?: { location_name: string };
  pickup_hotel?: { location_name: string };
}

export interface CreateVoucherPayload extends Omit<Voucher, 'id' | 'voucher_no' | 'hotel' | 'attraction' | 'tour' | 'pickup_hotel'> {
  voucher_no?: string;
}

