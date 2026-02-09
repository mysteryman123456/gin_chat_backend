import { UserRepository } from "../repositories/user.repository";
import { IUser } from "../models/user.model";
import { HttpError } from "../utils/http_error";
import { UpdateUserProfileData } from "../dtos/user.dto";

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
}
