"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMasterLocationSchema = void 0;
const zod_1 = require("zod");
exports.CreateMasterLocationSchema = zod_1.z.object({
    location_code: zod_1.z.string().min(1, 'Location code is required'),
    location_name: zod_1.z.string().min(1, 'Location name is required'),
    location_address: zod_1.z.string().optional(),
    location_locatype: zod_1.z.string().optional(),
});
//# sourceMappingURL=create-master-location.dto.js.map