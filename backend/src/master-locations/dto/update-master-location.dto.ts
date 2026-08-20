import { z } from 'zod';
import { CreateMasterLocationSchema } from './create-master-location.dto';

export const UpdateMasterLocationSchema = CreateMasterLocationSchema.partial();

export type UpdateMasterLocationDto = z.infer<typeof UpdateMasterLocationSchema>;
