export interface Customer {
  id: string;
  cus_nickname: string;
  cus_name: string;
  cus_address?: string;
  cus_tel?: string;
  cus_fax?: string;
  cus_note?: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCustomerPayload {
  cus_nickname: string;
  cus_name: string;
  cus_address?: string;
  cus_tel?: string;
  cus_fax?: string;
  cus_note?: string;
}
