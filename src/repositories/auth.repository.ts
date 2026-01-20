import { IUser, UserModel } from "../models/user.model";

export class AuthRepository {
  async createUser(data: Partial<IUser>) {
    const user = await UserModel.create(data);
    return await UserModel.findById(user._id, {
      _id: 1,
      username: 1,
      password: 1,
      email: 1,
    });
  }

  async loginUser(email: string) {
    return UserModel.findOne(
      { email },
      { _id: 1, username: 1, email: 1, password: 1 }
    );
  }
}
