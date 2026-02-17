"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const banner_controller_1 = require("./banner.controller");
const requiredAuth_1 = require("middlewares/requiredAuth");
const upload_1 = require("middlewares/upload");
const router = express_1.default.Router();
// get banners for users . 
router.get('/', banner_controller_1.getBanners);
// create banners for admin 
router.post('/', requiredAuth_1.requireAuth, upload_1.upload.single('image'), banner_controller_1.createBanner);
// delete banner for admin
router.delete('/:id', requiredAuth_1.requireAuth, banner_controller_1.deleteBanner);
// update banner for admin
router.put('/:id', requiredAuth_1.requireAuth, banner_controller_1.updateBanner);
exports.default = router;
