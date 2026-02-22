"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_repository_1 = require("../repositories/user.repository");
const http_error_1 = require("../utils/http_error");
const hash_1 = require("../utils/hash");
class UserService {
    constructor() {
        this.updateProfile = async (id, data) => {
            const updatedUser = await this.userRepo.updateProfile(id, data);
            if (!updatedUser)
                throw new http_error_1.HttpError("User not found", 400);
            return updatedUser;
        };
        this.getSearchedUser = async (user) => {
            const searched_users = await this.userRepo.getSearchedUser(user);
            if (!searched_users)
                throw new http_error_1.HttpError("User not found", 400);
            return searched_users;
        };
        this.userRepo = new user_repository_1.UserRepository();
    }
    async updatePassword(userId, data) {
        const user = await this.userRepo.getUserById(userId);
        if (!user)
            throw new http_error_1.HttpError("User not found", 404);
        const isMatch = await hash_1.HashUtil.compare(data.old_password, user.password);
        if (!isMatch)
            throw new http_error_1.HttpError("Old password is incorrect", 400);
        const hashed = await hash_1.HashUtil.hash(data.new_password);
        await this.userRepo.updatePasswordById(userId, hashed);
    }
}
exports.UserService = UserService;
