"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    constructor({ success, message, data, meta, }) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.meta = meta;
    }
    static success(data, message = "Success") {
        return new ApiResponse({
            success: true,
            message,
            data,
        });
    }
    static error(message = "Error") {
        return new ApiResponse({
            success: false,
            message,
        });
    }
}
exports.ApiResponse = ApiResponse;
