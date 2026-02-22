"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const user_dto_1 = require("../dtos/user.dto");
const http_error_1 = require("../utils/http_error");
const jwt_1 = require("../utils/jwt");
class AuthController {
    constructor() {
        this.authService = new auth_service_1.AuthService();
        this.signup = async (req, res) => {
            const validatedData = user_dto_1.SignupSchema.safeParse(req.body);
            if (!validatedData.success)
                throw new http_error_1.HttpError(validatedData.error.issues[0].message, 400);
            const result = await this.authService.signup(validatedData.data);
            return res.status(201).json({
                success: true,
                message: "Signup successful",
                data: result,
            });
        };
        this.verifyToken = async (req, res) => {
            const token = req.cookies.token;
            if (!token)
                throw new http_error_1.HttpError("Unauthorized", 401);
            const payload = jwt_1.JwtUtil.verifyToken(token);
            return res.status(200).json({
                success: true,
                message: "Token verified successfully",
                data: { payload },
            });
        };
        this.login = async (req, res) => {
            const validatedData = user_dto_1.LoginSchema.safeParse(req.body);
            if (!validatedData.success)
                throw new http_error_1.HttpError(validatedData.error.issues[0].message, 400);
            const result = await this.authService.login(validatedData.data);
            res.cookie("token", result.token, {
                httpOnly: true,
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                secure: process.env.NODE_ENV === "production",
                maxAge: 1000 * 60 * 60 * 24 * 7,
            });
            return res.status(200).json({
                success: true,
                message: "Login successful",
                data: result,
            });
        };
        this.logout = async (req, res) => {
            res.clearCookie("token", {
                httpOnly: true,
                sameSite: "lax",
                secure: false,
            });
            return res.status(200).json({
                success: true,
                message: "Logged out successfully",
            });
        };
        this.forgotPassword = async (req, res) => {
            const { email } = req.body;
            if (!email)
                throw new http_error_1.HttpError("Email is required", 400);
            const token = await this.authService.forgotPassword(email);
            return res.json({
                success: true,
                message: "If email exists, OTP sent.",
                data: { token },
            });
        };
        this.resetPassword = async (req, res) => {
            const { password, otp } = req.body;
            const token = req.query.token;
            if (!token)
                throw new http_error_1.HttpError("Token missing", 400);
            await this.authService.resetPassword(token, otp, password);
            return res.json({
                success: true,
                message: "Password reset successful",
            });
        };
    }
}
exports.AuthController = AuthController;
