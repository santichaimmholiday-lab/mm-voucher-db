import { z } from 'zod';
import { CreateVoucherSchema } from './create-voucher.dto';

export const UpdateVoucherSchema = CreateVoucherSchema.partial();

export type UpdateVoucherDto = z.infer<typeof UpdateVoucherSchema>;
