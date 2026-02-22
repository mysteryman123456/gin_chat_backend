"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePasswordSchema = exports.UpdateUserByAdminSchema = exports.UpdateUserProfileSchema = exports.LoginSchema = exports.SignupSchema = exports.GeneralUserScehema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.GeneralUserScehema = zod_1.default.object({
    username: zod_1.default.string("Username is required").min(3, "Username is reuired"),
    email: zod_1.default
        .email({ error: "Please provide a valid email" })
        .min(2, "Email is required"),
    password: zod_1.default
        .string("Password is required")
        .regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,20}$/, "Password must be 8-20 chars with at least one number and a special char"),
    profile_image: zod_1.default
        .string()
        .min(10, "Profile image url is required")
        .optional()
        .nullable(),
});
exports.SignupSchema = exports.GeneralUserScehema.pick({
    username: true,
    email: true,
}).extend({
    password: zod_1.default
        .string({ error: "Password is required" })
        .min(1, "Password is required"),
});
exports.LoginSchema = exports.GeneralUserScehema.pick({
    email: true,
    password: true,
});
exports.UpdateUserProfileSchema = exports.GeneralUserScehema.pick({
    username: true,
    profile_image: true,
});
exports.UpdateUserByAdminSchema = zod_1.default.object({
    username: zod_1.default.string().min(1).optional(),
    profile_image: zod_1.default.string().optional().nullable(),
    role: zod_1.default.enum(["user", "admin"]),
    is_blocked: zod_1.default.boolean(),
});
exports.updatePasswordSchema = zod_1.default.object({
    old_password: zod_1.default.string().min(1),
    new_password: zod_1.default.string().min(6, "Password must be at least 6 characters"),
    confirm_password: zod_1.default.string().min(1),
});
