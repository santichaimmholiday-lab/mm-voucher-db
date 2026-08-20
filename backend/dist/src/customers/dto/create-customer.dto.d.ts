import { z } from 'zod';
export declare const CreateCustomerSchema: z.ZodObject<{
    cus_nickname: z.ZodString;
    cus_name: z.ZodString;
    cus_address: z.ZodOptional<z.ZodString>;
    cus_tel: z.ZodOptional<z.ZodString>;
    cus_fax: z.ZodOptional<z.ZodString>;
    cus_note: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateCustomerDto = z.infer<typeof CreateCustomerSchema>;
