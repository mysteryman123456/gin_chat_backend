"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const admin_repository_1 = require("../repositories/admin.repository");
const http_error_1 = require("../utils/http_error");
const hash_1 = require("../utils/hash");
const config_1 = require("../config");
class AdminService {
    constructor() {
        this.adminRepo = new admin_repository_1.AdminRepository();
    }
    async getAllUsers(page) {
        const [count, users] = await Promise.all([
            this.adminRepo.countAllUsers(),
            this.adminRepo.getAllUsers(page),
        ]);
        return {
            users: users,
            current_page: page,
            total_pages: Math.ceil(count / config_1.DEFAULT_PAGINATION_LIMIT),
        };
    }
    async createUser(data) {
        const hashedPassword = await hash_1.HashUtil.hash(data.password);
        return this.adminRepo.createUser({
            ...data,
            password: hashedPassword,
        });
    }
    async updateUser(id, data) {
        const updatedUser = await this.adminRepo.updateUserById(id, data);
        if (!updatedUser)
            throw new http_error_1.HttpError("User not found", 404);
        return updatedUser;
    }
    async deleteUser(id) {
        const deletedUser = await this.adminRepo.deleteUserById(id);
        if (!deletedUser)
            throw new http_error_1.HttpError("User not found", 404);
    }
    async getUserById(id) {
        const user = await this.adminRepo.findById(id);
        if (!user)
            throw new http_error_1.HttpError("User not found", 404);
        return user;
    }
    async updateUserDetailsByAdmin(id, data) {
        const updatedUser = await this.adminRepo.updateUserDetailsByAdmin(id, data);
        if (!updatedUser)
            throw new http_error_1.HttpError("User not found", 404);
        return updatedUser;
    }
}
exports.AdminService = AdminService;
