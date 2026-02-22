"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const user_repository_1 = require("../repositories/user.repository");
const auth_repository_1 = require("../repositories/auth.repository");
const jwt_1 = require("../utils/jwt");
const hash_1 = require("../utils/hash");
const http_error_1 = require("../utils/http_error");
const otpGenerate_1 = require("../utils/otpGenerate");
const email_service_1 = require("./email.service");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class AuthService {
    constructor() {
        this.userRepo = new user_repository_1.UserRepository();
        this.authRepo = new auth_repository_1.AuthRepository();
    }
    async signup(data) {
        const existingUser = await this.userRepo.getUserByEmail(data.email);
        if (existingUser)
            throw new http_error_1.HttpError("User already exists", 400);
        const hashedPassword = await hash_1.HashUtil.hash(data.password);
        const user = await this.authRepo.createUser({
            username: data.username,
            email: data.email,
            password: hashedPassword,
        });
        return user;
    }
    async login(data) {
        const user = await this.authRepo.loginUser(data.email);
        if (!user)
            throw new http_error_1.HttpError("Invalid email or password", 400);
        if (user.is_blocked)
            throw new http_error_1.HttpError("User is blocked", 400);
        const isPasswordValid = await hash_1.HashUtil.compare(data.password, user.password);
        if (!isPasswordValid)
            throw new http_error_1.HttpError("Invalid email or password", 400);
        const token = jwt_1.JwtUtil.generateToken({
            profile_image: user.profile_image ?? null,
            username: user.username,
            email: user.email,
            _id: user._id,
            role: user.role,
        });
        return {
            token,
            _id: user._id,
            email: user.email,
            username: user.username,
        };
    }
    async forgotPassword(email) {
        const user = await this.userRepo.getUserByEmail(email);
        if (!user)
            return null;
        const otp = (0, otpGenerate_1.generateOtp)(6);
        const expires = new Date(Date.now() + 3 * 60 * 1000);
        await this.authRepo.setOtp(email, otp, expires);
        await email_service_1.emailService.sendEmail(email, "Password Reset OTP", `
        <h2>Password Reset</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP expires in 3 minutes.</p>
      `);
        const token = jwt_1.JwtUtil.generateToken({ email }, "3m");
        return token;
    }
    async resetPassword(token, otp, newPassword) {
        let email;
        try {
            const decoded = jwt_1.JwtUtil.verifyToken(token);
            email = decoded.email;
        }
        catch {
            throw new http_error_1.HttpError("Invalid or expired token", 400);
        }
        const user = await this.userRepo.getUserByEmail(email);
        if (!user) {
            throw new http_error_1.HttpError("Invalid token", 400);
        }
        if (!user.otp ||
            user.otp !== otp ||
            !user.otp_expires ||
            user.otp_expires < new Date()) {
            throw new http_error_1.HttpError("Invalid or expired OTP", 400);
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await this.authRepo.updatePasswordAndClearOtp(email, hashedPassword);
        return true;
    }
}
exports.AuthService = AuthService;
