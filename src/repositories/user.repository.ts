import { UpdateUserProfileData } from "../dtos/user.dto";
import { IUser, UserModel } from "../models/user.model";

export class UserRepository {
  async getUserByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email });
  }

  async getUserById(id: string): Promise<IUser | null> {
    return UserModel.findById(id);
  }

  async updateProfile(
    id: string,
    data: UpdateUserProfileData
  ): Promise<IUser | null> {
    return await UserModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, select: "-password" }
    );
  }
}
