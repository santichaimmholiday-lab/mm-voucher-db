export interface MasterLocation {
  id: string;
  location_code: string;
  location_name: string;
  location_address?: string;
  location_locatype?: string;
  locatype?: { locatype_name: string };
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateMasterLocationPayload {
  location_code: string;
  location_name: string;
  location_address?: string;
  location_locatype: string;
}
