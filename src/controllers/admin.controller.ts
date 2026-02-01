import { Request, Response } from "express";
import { AdminService } from "../services/admin.service";
import { GeneralUserScehema } from "../dtos/user.dto";
import { HttpError } from "../utils/http_error";

export class AdminController {
  private adminService = new AdminService();

  getAllUsers = async (req: Request, res: Response) => {
    const users = await this.adminService.getAllUsers();
    return res.json({ success: true, data: users });
  };

  createUser = async (req: Request, res: Response) => {
    const validation = GeneralUserScehema.safeParse(req.body);
    if (!validation.success) {
      throw new HttpError(validation.error.issues[0].message, 400);
    }

    const user = await this.adminService.createUser(validation.data);
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  };

  updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;
    const updatedUser = await this.adminService.updateUser(id, data);
    return res.json({ success: true, data: updatedUser });
  };

  deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.adminService.deleteUser(id);
    return res.json({ success: true, message: "User deleted successfully" });
  };
}
