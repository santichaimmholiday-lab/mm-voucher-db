import { z } from 'zod';

export const CreateMasterLocationSchema = z.object({
  location_code: z.string().min(1, 'Location code is required'),
  location_name: z.string().min(1, 'Location name is required'),
  location_address: z.string().optional(),
  location_locatype: z.string().optional(),
});

export type CreateMasterLocationDto = z.infer<typeof CreateMasterLocationSchema>;
