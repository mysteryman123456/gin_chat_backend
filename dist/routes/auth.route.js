"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
//
const authRoute = express_1.default.Router();
//
const authController = new auth_controller_1.AuthController();
//
authRoute.post("/login", authController.login);
authRoute.post("/signup", authController.signup);
authRoute.post("/logout", authController.logout);
authRoute.get("/verify-token", authController.verifyToken);
authRoute.post("/forgot-password", authController.forgotPassword);
authRoute.post("/reset-password", authController.resetPassword);
//
exports.default = authRoute;
