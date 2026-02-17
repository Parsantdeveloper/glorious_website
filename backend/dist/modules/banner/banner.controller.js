"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBanner = exports.deleteBanner = exports.createBanner = exports.getBanners = void 0;
const prisma_1 = __importDefault(require("config/prisma"));
const ApiResponce_1 = require("utils/ApiResponce");
const banner_schema_1 = require("./banner.schema");
const getBanners = async (req, res, next) => {
    try {
        const banners = await prisma_1.default.banner.findMany(({
            where: { isActive: true },
            orderBy: { validFrom: 'desc' }
        }));
        if (banners.length === 0) {
            return res.status(404).json(ApiResponce_1.ApiResponse.error('No banners found'));
        }
        return res.status(200).json(ApiResponce_1.ApiResponse.success(banners, 'Banners fetched successfully'));
    }
    catch (error) {
        next(error);
    }
};
exports.getBanners = getBanners;
const createBanner = async (req, res, next) => {
    try {
        let data = banner_schema_1.createBannerSchema.parse(req.body);
        const image = req.file.path;
        console.log(image);
        const banner = await prisma_1.default.banner.create({
            data: {
                ...data,
                imageUrl: image,
            },
        });
        if (!banner) {
            return res.status(400).json(ApiResponce_1.ApiResponse.error('Failed to create banner'));
        }
        return res.status(201).json(ApiResponce_1.ApiResponse.success(banner, 'Banner created successfully'));
    }
    catch (error) {
        next(error);
    }
};
exports.createBanner = createBanner;
const deleteBanner = async (req, res, next) => {
    try {
        const id = req.params.id;
        const banner = await prisma_1.default.banner.delete({
            where: { id }
        });
        if (!banner) {
            return res.status(404).json(ApiResponce_1.ApiResponse.error('Banner not found'));
        }
        return res.status(200).json(ApiResponce_1.ApiResponse.success(banner, 'Banner deleted successfully'));
    }
    catch (error) {
        next(error);
    }
};
exports.deleteBanner = deleteBanner;
const updateBanner = async (req, res, next) => {
    try {
        let body = banner_schema_1.updateBannerSchema.parse(req.body);
        const id = req.params.id;
        const banner = await prisma_1.default.banner.update({
            where: { id },
            data: body,
        });
        if (!banner) {
            return res.status(404).json(ApiResponce_1.ApiResponse.error('Banner not found'));
        }
        return res.status(200).json(ApiResponce_1.ApiResponse.success(banner, 'Banner updated successfully'));
    }
    catch (error) {
        next(error);
    }
};
exports.updateBanner = updateBanner;
