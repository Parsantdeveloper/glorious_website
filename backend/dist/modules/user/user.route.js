"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("better-auth/node");
const auth_1 = require("@/utils/auth"); // Your Better Auth instance
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get("/me", async (req, res) => {
    const session = await auth_1.auth.api.getSession({
        headers: (0, node_1.fromNodeHeaders)(req.headers)
    });
    return res.json(session);
});
exports.default = router;
