"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtUtil = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JwtUtil {
    static generateToken(payload, jwt_time = "7d") {
        return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
            expiresIn: jwt_time,
        });
    }
    static verifyToken(token) {
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        return payload;
    }
}
exports.JwtUtil = JwtUtil;
