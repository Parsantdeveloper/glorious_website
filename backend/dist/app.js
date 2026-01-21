"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const node_1 = require("better-auth/node");
const auth_1 = require("@/utils/auth");
const user_route_1 = __importDefault(require("./modules/user/user.route"));
const error_middleware_1 = require("./middlewares/error.middleware");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)());
exports.app.use((0, helmet_1.default)());
exports.app.use((0, morgan_1.default)("dev"));
exports.app.all("/api/auth/*", (0, node_1.toNodeHandler)(auth_1.auth)); // For ExpressJS v4
exports.app.use(express_1.default.json());
exports.app.use("/api/users", user_route_1.default);
exports.app.use(error_middleware_1.errorHandler);
