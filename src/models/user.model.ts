import mongoose, { Document, Schema } from "mongoose";
import { GeneralUserDataType } from "../dtos/user.dto";

export interface IUser extends GeneralUserDataType, Document {
  _id: mongoose.Types.ObjectId;
  is_blocked: boolean;
  role: string;
  otp?: string;
  otp_expires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    profile_image: { type: String, required: false },
    otp_expires: { type: Date, default: null },
    is_blocked: { type: Boolean, default: false },
    otp: { type: String, default: null },
  },
  { timestamps: true, collection: "users" }
);

export const UserModel = mongoose.model<IUser>("User", UserSchema);
