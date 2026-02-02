import { UserRepository } from "../repositories/user.repository";
import { IUser } from "../models/user.model";
import { HttpError } from "../utils/http_error";
import { UpdateUserProfileData } from "../dtos/user.dto";

export class UserService {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  async updateProfile(id: string, data: UpdateUserProfileData): Promise<IUser> {
    const updatedUser = await this.userRepo.updateProfile(id, data);
    if (!updatedUser) throw new HttpError("User not found", 400);
    return updatedUser;
  }
}
