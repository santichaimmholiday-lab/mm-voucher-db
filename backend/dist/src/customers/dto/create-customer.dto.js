"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCustomerSchema = void 0;
const zod_1 = require("zod");
exports.CreateCustomerSchema = zod_1.z.object({
    cus_nickname: zod_1.z.string().min(1, 'Nickname is required').max(100, 'Nickname is too long'),
    cus_name: zod_1.z.string().min(1, 'Customer Name is required'),
    cus_address: zod_1.z.string().optional(),
    cus_tel: zod_1.z.string().optional(),
    cus_fax: zod_1.z.string().optional(),
    cus_note: zod_1.z.string().optional(),
});
//# sourceMappingURL=create-customer.dto.js.map