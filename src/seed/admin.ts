import mongoose from "mongoose";
import dotenv from "dotenv";
import { UserModel } from "../models/user.model";
import { HashUtil } from "../utils/hash";

dotenv.config();

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);

    const email = "ginchat_admin@gmail.com";

    const existingAdmin = await UserModel.findOne({ email });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await HashUtil.hash("S@msungm21");

    await UserModel.create({
      username: "admin",
      email,
      password: hashedPassword,
      profile_image: null,
      role: "admin",
    });

    console.log("Admin user created successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
}

seedAdmin();
