"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAddressSchema = exports.createAddressSchema = void 0;
const zod_1 = require("zod");
const baseAddressSchema = {
    fullName: zod_1.z.string().min(2).max(100),
    phone: zod_1.z.string().regex(/^(?:\+977)?9[6-9]\d{8}$/),
    district: zod_1.z.string().min(2).max(50),
    city: zod_1.z.string().min(2).max(50),
    tole: zod_1.z.string().min(2).max(100),
    postalCode: zod_1.z.string().regex(/^\d{5}$/).optional(),
    addressLine: zod_1.z.string().max(200).optional(),
};
exports.createAddressSchema = zod_1.z.object(baseAddressSchema);
exports.updateAddressSchema = zod_1.z.object(baseAddressSchema).partial();
