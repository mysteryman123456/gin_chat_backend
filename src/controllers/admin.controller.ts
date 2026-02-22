import { Request, Response } from "express";
import { AdminService } from "../services/admin.service";
import { GeneralUserScehema, UpdateUserByAdminSchema } from "../dtos/user.dto";
import { HttpError } from "../utils/http_error";

export class AdminController {
  private adminService = new AdminService();

  getAllUsers = async (req: Request, res: Response) => {
    let pageNo = 1;
    let { page } = req.query;
    if (typeof page === "string" && page !== undefined && page !== null) {
      pageNo = Number(page);
    }
    const response = await this.adminService.getAllUsers(pageNo);
    return res.json({ success: true, data: response });
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

  getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await this.adminService.getUserById(id);
    return res.json({
      success: true,
      data: user,
    });
  };

  updateUserByAdminById = async (req: Request, res: Response) => {
    const { id } = req.params;

    const validation = UpdateUserByAdminSchema.safeParse(req.body);
    if (!validation.success) {
      throw new HttpError(validation.error.issues[0].message, 400);
    }

    const updatedUser = await this.adminService.updateUserDetailsByAdmin(
      id,
      validation.data
    );
    return res.json({ success: true, data: updatedUser });
  };
}
