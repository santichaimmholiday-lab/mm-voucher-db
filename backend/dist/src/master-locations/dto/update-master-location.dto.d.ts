import { z } from 'zod';
export declare const UpdateMasterLocationSchema: z.ZodObject<{
    location_code: z.ZodOptional<z.ZodString>;
    location_name: z.ZodOptional<z.ZodString>;
    location_address: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    location_locatype: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export type UpdateMasterLocationDto = z.infer<typeof UpdateMasterLocationSchema>;
