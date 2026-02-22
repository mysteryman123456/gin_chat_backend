"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const user_model_1 = require("../models/user.model");
class AuthRepository {
    async createUser(data) {
        const user = await user_model_1.UserModel.create(data);
        return await user_model_1.UserModel.findById(user._id, {
            _id: 1,
            username: 1,
            password: 1,
            email: 1,
        });
    }
    async loginUser(email) {
        return user_model_1.UserModel.findOne({ email }, { _id: 1, username: 1, email: 1, password: 1, role: 1, profile_image: 1 });
    }
    async setOtp(email, otp, expires) {
        await user_model_1.UserModel.updateOne({ email }, {
            $set: {
                otp,
                otp_expires: expires,
            },
        });
    }
    async updatePasswordAndClearOtp(email, hashedPassword) {
        await user_model_1.UserModel.updateOne({ email }, {
            $set: { password: hashedPassword },
            $unset: { otp: "", otp_expires: "" },
        });
    }
}
exports.AuthRepository = AuthRepository;
