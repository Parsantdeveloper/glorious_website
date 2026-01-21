"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const errorHandler = (err, 
// req: Request,
res) => {
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json(err);
    }
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
};
exports.errorHandler = errorHandler;
