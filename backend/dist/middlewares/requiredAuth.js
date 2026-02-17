"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const auth_1 = require("../utils/auth");
const node_1 = require("better-auth/node");
async function requireAuth(req, res, next) {
    const session = await auth_1.auth.api.getSession({
        headers: (0, node_1.fromNodeHeaders)(req.headers),
    });
    if (!session) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = session.user;
    req.session = session;
    next();
}
