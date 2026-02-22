"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtp = generateOtp;
const crypto_1 = __importDefault(require("crypto"));
function generateOtp(length = 6) {
    const charset = "ABCDEFGHIJKLM~!@#$%^&*NOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let otp = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = crypto_1.default.randomInt(0, charset.length);
        otp += charset[randomIndex];
    }
    return otp;
}
