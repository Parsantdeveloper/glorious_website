"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBannerSchema = exports.createBannerSchema = void 0;
const zod_1 = require("zod");
exports.createBannerSchema = zod_1.z.object({
    linkUrl: zod_1.z.string().url().optional(),
    validFrom: zod_1.z.date().optional(),
    validUntil: zod_1.z.date().optional(),
    isActive: zod_1.z.boolean().default(true),
});
exports.updateBannerSchema = exports.createBannerSchema.partial();
