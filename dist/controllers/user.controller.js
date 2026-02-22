"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
const user_dto_1 = require("../dtos/user.dto");
const http_error_1 = require("../utils/http_error");
class UserController {
    constructor() {
        this.updateProfile = async (req, res) => {
            const id = req.params.id;
            const validation = user_dto_1.UpdateUserProfileSchema.safeParse(req.body);
            if (!validation.success)
                throw new http_error_1.HttpError(validation.error.issues[0].message, 400);
            const updatedUser = await this.userService.updateProfile(id, validation.data);
            return res.json({ success: true, data: updatedUser });
        };
        this.getSearchedUser = async (req, res) => {
            const user = req.params.user;
            if (!user.trim())
                throw new http_error_1.HttpError("Search params is required", 400);
            const searched_users = await this.userService.getSearchedUser(user);
            return res.status(200).json({ data: searched_users, success: true });
        };
        this.updatePassword = async (req, res) => {
            const validation = user_dto_1.updatePasswordSchema.safeParse(req.body);
            if (!validation.success) {
                throw new http_error_1.HttpError(validation.error.issues[0].message, 400);
            }
            console.log(req.user);
            await this.userService.updatePassword(req.user?._id, validation.data);
            return res.json({
                success: true,
                message: "Password updated successfully",
            });
        };
        this.userService = new user_service_1.UserService();
    }
}
exports.UserController = UserController;
