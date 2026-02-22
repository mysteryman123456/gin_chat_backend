import { UserRepository } from "../repositories/user.repository";
import { IUser } from "../models/user.model";
import { HttpError } from "../utils/http_error";
import { UpdatePasswordType, UpdateUserProfileData } from "../dtos/user.dto";
import { HashUtil } from "../utils/hash";

export class UserService {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  updateProfile = async (
    id: string,
    data: UpdateUserProfileData
  ): Promise<IUser> => {
    const updatedUser = await this.userRepo.updateProfile(id, data);
    if (!updatedUser) throw new HttpError("User not found", 400);
    return updatedUser;
  };

  getSearchedUser = async (user: string) => {
    const searched_users = await this.userRepo.getSearchedUser(user);
    if (!searched_users) throw new HttpError("User not found", 400);
    return searched_users;
  };

  async updatePassword(userId: string, data: UpdatePasswordType) {
    const user = await this.userRepo.getUserById(userId);

    if (!user) throw new HttpError("User not found", 404);

    const isMatch = await HashUtil.compare(data.old_password, user.password);
    if (!isMatch) throw new HttpError("Old password is incorrect", 400);

    const hashed = await HashUtil.hash(data.new_password);
    await this.userRepo.updatePasswordById(userId, hashed);
  }
}
