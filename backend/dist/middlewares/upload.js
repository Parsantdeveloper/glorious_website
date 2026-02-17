"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.default,
    params: async (req, file) => {
        let folder = "misc";
        if (req.baseUrl.includes("products"))
            folder = "products";
        if (req.baseUrl.includes("banners"))
            folder = "banners";
        if (req.baseUrl.includes("categories"))
            folder = "categories";
        return {
            folder,
            resource_type: "image",
            format: "webp", // auto-optimized
            public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
            transformation: [
                { quality: "auto", fetch_format: "auto" },
            ],
        };
    },
});
exports.upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});
