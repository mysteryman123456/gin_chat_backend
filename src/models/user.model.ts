import mongoose, { Document, Schema } from "mongoose";
import { GeneralUserDataType } from "../dtos/user.dto";

export interface IUser extends GeneralUserDataType, Document {
  _id: mongoose.Types.ObjectId;
  isBlocked: boolean;
  role: string;
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
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<IUser>("User", UserSchema);
