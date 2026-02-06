import { GeneralUserDataType, UpdateUserProfileData } from "../dtos/user.dto";
import { IUser, UserModel } from "../models/user.model";

type SearchedUsers = Pick<
  GeneralUserDataType,
  "email" | "username" | "profile_image"
> & {
  _id: string;
};

export class UserRepository {
  //
  async getSearchedUser(user: string): Promise<SearchedUsers[]> {
    const searched_user = await UserModel.findOne(
      {
        email: { $regex: user, $options: "i" },
      },
      { email: 1, username: 1, profile_image: 1, _id: 1 }
    );
    if (!searched_user) return [];
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
  async getUserByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email });
  }
  //
  async getUserById(id: string): Promise<IUser | null> {
    return UserModel.findById(id);
  }
  //
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
