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
}
