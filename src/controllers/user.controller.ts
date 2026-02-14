import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { UpdateUserProfileSchema } from "../dtos/user.dto";
import { HttpError } from "../utils/http_error";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  updateProfile = async (req: Request, res: Response) => {
    const { id } = req.params;
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
    const { user } = req.params;
    if (!user.trim()) throw new HttpError("Search params is required", 400);
    const searched_users = await this.userService.getSearchedUser(user);
    return res.status(200).json({ data: searched_users, success: true });
  };
}
