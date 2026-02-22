"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_model_1 = require("../models/user.model");
const hash_1 = require("../utils/hash");
dotenv_1.default.config();
async function seedAdmin() {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URI);
        const email = "ginchat_admin@gmail.com";
        const existingAdmin = await user_model_1.UserModel.findOne({ email });
        if (existingAdmin) {
            console.log("Admin already exists");
            process.exit(0);
        }
        const hashedPassword = await hash_1.HashUtil.hash("S@msungm21");
        await user_model_1.UserModel.create({
            username: "admin",
            email,
            password: hashedPassword,
            profile_image: null,
            role: "admin",
        });
        console.log("Admin user created successfully");
        process.exit(0);
    }
    catch (error) {
        console.error("Error seeding admin:", error);
        process.exit(1);
    }
}
seedAdmin();
