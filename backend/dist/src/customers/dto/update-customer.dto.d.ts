import { z } from 'zod';
export declare const UpdateCustomerSchema: z.ZodObject<{
    cus_nickname: z.ZodOptional<z.ZodString>;
    cus_name: z.ZodOptional<z.ZodString>;
    cus_address: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    cus_tel: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    cus_fax: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    cus_note: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export type UpdateCustomerDto = z.infer<typeof UpdateCustomerSchema>;
