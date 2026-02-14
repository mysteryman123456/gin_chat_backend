import {
  AdminRepository,
  CreateAdminUserData,
  UpdateAdminUserData,
} from "../repositories/admin.repository";
import { IUser } from "../models/user.model";
import { HttpError } from "../utils/http_error";
import { HashUtil } from "../utils/hash";
import { DEFAULT_PAGINATION_LIMIT } from "../config";

export class AdminService {
  private adminRepo = new AdminRepository();

  async getAllUsers(page: number) {
    const [count, users] = await Promise.all([
      this.adminRepo.countAllUsers(),
      this.adminRepo.getAllUsers(page),
    ]);
    return {
      users: users,
      current_page: page,
      total_pages: Math.ceil(count / DEFAULT_PAGINATION_LIMIT),
    };
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
