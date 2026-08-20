import { z } from 'zod';
export declare const CreateMasterLocationSchema: z.ZodObject<{
    location_code: z.ZodString;
    location_name: z.ZodString;
    location_address: z.ZodOptional<z.ZodString>;
    location_locatype: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateMasterLocationDto = z.infer<typeof CreateMasterLocationSchema>;
