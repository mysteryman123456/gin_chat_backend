import {
  AdminRepository,
  CreateAdminUserData,
  UpdateAdminUserData,
} from "../repositories/admin.repository";
import { IUser } from "../models/user.model";
import { HttpError } from "../utils/http_error";
import { HashUtil } from "../utils/hash";

export class AdminService {
  private adminRepo = new AdminRepository();

  async getAllUsers(): Promise<IUser[]> {
    return this.adminRepo.getAllUsers();
  }

  async createUser(data: CreateAdminUserData) {
    const hashedPassword = await HashUtil.hash(data.password);

    return this.adminRepo.createUser({
      ...data,
      password: hashedPassword,
    });
  }

  async updateUser(id: string, data: UpdateAdminUserData): Promise<IUser> {
    const updatedUser = await this.adminRepo.updateUserById(id, data);
    if (!updatedUser) throw new HttpError("User not found", 404);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    const deletedUser = await this.adminRepo.deleteUserById(id);
    if (!deletedUser) throw new HttpError("User not found", 404);
  }
}
