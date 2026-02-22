"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const user_model_1 = require("../models/user.model");
class UserRepository {
    //
    async getSearchedUser(user) {
        const searched_user = await user_model_1.UserModel.findOne({
            email: { $regex: user, $options: "i" },
        }, { email: 1, username: 1, profile_image: 1, _id: 1 });
        if (!searched_user)
            return [];
        return [
            {
                email: searched_user.email,
                username: searched_user.username,
                profile_image: searched_user.profile_image,
                _id: searched_user._id.toString(),
            },
        ];
    }
    //
    async getUserByEmail(email) {
        return user_model_1.UserModel.findOne({ email });
    }
    //
    async getUserById(id) {
        return user_model_1.UserModel.findById(id);
    }
    //
    async updateProfile(id, data) {
        return await user_model_1.UserModel.findByIdAndUpdate(id, { $set: data }, { new: true, select: "-password" });
    }
    async updatePasswordById(id, hashedPassword) {
        return user_model_1.UserModel.findByIdAndUpdate(id, {
            $set: { password: hashedPassword },
        });
    }
}
exports.UserRepository = UserRepository;
