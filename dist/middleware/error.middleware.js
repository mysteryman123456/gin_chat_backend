"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const http_error_1 = require("../utils/http_error");
const errorMiddleware = (err, _, res, next) => {
    const message = err instanceof http_error_1.HttpError ? err.message : err.message;
    const status = err instanceof http_error_1.HttpError ? err.status : 500;
    return res.status(status).json({
        success: false,
        error: message,
    });
};
exports.errorMiddleware = errorMiddleware;
