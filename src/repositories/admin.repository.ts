import { IUser, UserModel } from "../models/user.model";
import { GeneralUserDataType } from "../dtos/user.dto";

export type UpdateAdminUserData = Pick<
  GeneralUserDataType,
  "username" | "profile_image"
>;

export type CreateAdminUserData = Pick<
  GeneralUserDataType,
  "username" | "email" | "password" | "profile_image"
>;

export class AdminRepository {
  async getAllUsers(): Promise<IUser[]> {
    return UserModel.find({}, { password: 0 }).sort({ createdAt: -1 });
  }

  async createUser(data: CreateAdminUserData): Promise<IUser> {
    const user = await UserModel.create(data);
    const userObj = user.toObject();
    delete (userObj as any).password;
    return userObj as IUser;
  }

  async updateUserById(
    id: string,
    data: UpdateAdminUserData
  ): Promise<IUser | null> {
    return UserModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, select: "-password" }
    );
  }

  async deleteUserById(id: string): Promise<IUser | null> {
    return UserModel.findByIdAndDelete(id);
  }
}
