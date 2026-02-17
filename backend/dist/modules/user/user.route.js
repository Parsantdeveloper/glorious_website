"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("better-auth/node");
const auth_1 = require("../../utils/auth"); // Your Better Auth instance
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const requiredAuth_1 = require("middlewares/requiredAuth");
const router = express_1.default.Router();
router.get("/me", async (req, res) => {
    const session = await auth_1.auth.api.getSession({
        headers: (0, node_1.fromNodeHeaders)(req.headers)
    });
    console.log(req.headers);
    return res.json(session);
});
// create user address
router.post("/address", requiredAuth_1.requireAuth, user_controller_1.createUserAddress);
// get user address 
router.get("/address/me", requiredAuth_1.requireAuth, user_controller_1.getUserAdress);
// delete user adddress 
router.delete("/address/:addressId", requiredAuth_1.requireAuth, user_controller_1.deleteUserAddress);
//update user address
router.put("/address/:addressId", requiredAuth_1.requireAuth, user_controller_1.updateUserAddress);
exports.default = router;
