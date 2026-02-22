"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const http_error_1 = require("../utils/http_error");
const jwt_1 = require("../utils/jwt");
const authMiddleware = (req, res, next) => {
    const token = req.cookies?.token;
    if (!token)
        return next(new http_error_1.HttpError("Authentication token missing", 401));
    try {
        const user = jwt_1.JwtUtil.verifyToken(token);
        req.user = user;
        next();
    }
    catch {
        throw new http_error_1.HttpError("Invalid token", 401);
    }
};
exports.authMiddleware = authMiddleware;
