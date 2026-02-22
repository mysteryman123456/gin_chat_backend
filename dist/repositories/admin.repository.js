"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRepository = void 0;
const user_model_1 = require("../models/user.model");
const config_1 = require("../config");
class AdminRepository {
    //
    async getAllUsers(page) {
        const skip = (page - 1) * config_1.DEFAULT_PAGINATION_LIMIT;
        return user_model_1.UserModel.find({}, { password: 0 })
            .limit(config_1.DEFAULT_PAGINATION_LIMIT)
            .skip(skip)
            .sort({ createdAt: -1 });
    }
    //
    async countAllUsers() {
        return await user_model_1.UserModel.countDocuments();
    }
    //
    async createUser(data) {
        const user = await user_model_1.UserModel.create(data);
        const userObj = user.toObject();
        delete userObj.password;
        return userObj;
    }
    //
    async updateUserById(id, data) {
        return user_model_1.UserModel.findByIdAndUpdate(id, { $set: data }, { new: true, select: "-password" });
    }
    //
    async deleteUserById(id) {
        return user_model_1.UserModel.findByIdAndDelete(id);
    }
    //
    async findById(id) {
        return user_model_1.UserModel.findById(id).select("username profile_image is_blocked role email");
    }
    async updateUserDetailsByAdmin(id, data) {
        return user_model_1.UserModel.findByIdAndUpdate(id, { $set: data }, { new: true, select: "-password" });
    }
}
exports.AdminRepository = AdminRepository;
