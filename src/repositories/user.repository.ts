import { IUser, UserModel } from "../models/user.model";

export class UserRepository {
  async getUserByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email });
  }

  async getUserById(id: string): Promise<IUser | null> {
    return UserModel.findById(id);
  }
}
