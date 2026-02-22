import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import {
  UpdateUserProfileSchema,
  updatePasswordSchema,
} from "../dtos/user.dto";
import { HttpError } from "../utils/http_error";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  updateProfile = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const validation = UpdateUserProfileSchema.safeParse(req.body);
    if (!validation.success)
      throw new HttpError(validation.error.issues[0].message, 400);
    const updatedUser = await this.userService.updateProfile(
      id,
      validation.data
    );
    return res.json({ success: true, data: updatedUser });
  };

  getSearchedUser = async (req: Request, res: Response) => {
    const user = req.params.user as string;
    if (!user.trim()) throw new HttpError("Search params is required", 400);
    const searched_users = await this.userService.getSearchedUser(user);
    return res.status(200).json({ data: searched_users, success: true });
  };

  updatePassword = async (req: Request, res: Response) => {
    const validation = updatePasswordSchema.safeParse(req.body);
    if (!validation.success) {
      throw new HttpError(validation.error.issues[0].message, 400);
    }
    console.log(req.user);
    await this.userService.updatePassword(req.user?._id!, validation.data);
    return res.json({
      success: true,
      message: "Password updated successfully",
    });
  };
}
