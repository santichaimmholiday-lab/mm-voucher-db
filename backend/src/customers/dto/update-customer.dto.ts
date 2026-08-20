import { z } from 'zod';
import { CreateCustomerSchema } from './create-customer.dto';

export const UpdateCustomerSchema = CreateCustomerSchema.partial();

export type UpdateCustomerDto = z.infer<typeof UpdateCustomerSchema>;
