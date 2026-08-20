import { z } from 'zod';

export const CreateCustomerSchema = z.object({
  cus_nickname: z.string().min(1, 'Nickname is required').max(100, 'Nickname is too long'),
  cus_name: z.string().min(1, 'Customer Name is required'),
  cus_address: z.string().optional(),
  cus_tel: z.string().optional(),
  cus_fax: z.string().optional(),
  cus_note: z.string().optional(),
});

export type CreateCustomerDto = z.infer<typeof CreateCustomerSchema>;
