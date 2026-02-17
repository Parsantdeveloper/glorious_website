"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserAddress = exports.deleteUserAddress = exports.getUserAdress = exports.createUserAddress = void 0;
const user_schema_1 = require("./user.schema");
const prisma_1 = __importDefault(require("../../config/prisma"));
const ApiResponce_1 = require("utils/ApiResponce");
const createUserAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const body = user_schema_1.createAddressSchema.parse(req.body);
        const address = await prisma_1.default.address.create({
            data: {
                userId,
                ...body,
            },
        });
        return res
            .status(201)
            .json(ApiResponce_1.ApiResponse.success(address, "address created successfully"));
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error
                ? JSON.parse(error.message)
                : "Something went wrong",
        });
    }
};
exports.createUserAddress = createUserAddress;
const getUserAdress = async (req, res) => {
    try {
        const userId = req.user.id;
        const address = await prisma_1.default.address.findMany({
            where: { userId },
        });
        return res
            .status(200)
            .json(ApiResponce_1.ApiResponse.success(address, "User Address retrieved successfully"));
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error
                ? JSON.parse(error.message)
                : "Something went wrong",
        });
    }
};
exports.getUserAdress = getUserAdress;
const deleteUserAddress = async (req, res) => {
    try {
        const addressId = req.params.addressId;
        const userId = req.user.id;
        const address = await prisma_1.default.address.delete({
            where: { id: addressId, userId },
        });
        return res
            .status(200)
            .json(ApiResponce_1.ApiResponse.success(address, "User Address deleted successfully"));
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error
                ? JSON.parse(error.message)
                : "Something went wrong",
        });
    }
};
exports.deleteUserAddress = deleteUserAddress;
const updateUserAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const addressId = req.params.addressId;
        const body = user_schema_1.updateAddressSchema.parse(req.body);
        console.log("ya samma aaxa hai");
        const address = await prisma_1.default.address.update({
            where: {
                id: addressId,
                userId,
            },
            data: {
                ...body,
            },
        });
        console.log("logging body + ", body);
        console.log("address    " + address);
        return res
            .status(200)
            .json(ApiResponce_1.ApiResponse.success(address, "User Adress updated successfully"));
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error
                ? JSON.parse(error.message)
                : "Something went wrong",
        });
    }
};
exports.updateUserAddress = updateUserAddress;
