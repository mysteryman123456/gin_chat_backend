"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const admin_service_1 = require("../services/admin.service");
const user_dto_1 = require("../dtos/user.dto");
const http_error_1 = require("../utils/http_error");
class AdminController {
    constructor() {
        this.adminService = new admin_service_1.AdminService();
        this.getAllUsers = async (req, res) => {
            let pageNo = 1;
            let { page } = req.query;
            if (typeof page === "string" && page !== undefined && page !== null) {
                pageNo = Number(page);
            }
            const response = await this.adminService.getAllUsers(pageNo);
            return res.json({ success: true, data: response });
        };
        this.createUser = async (req, res) => {
            const validation = user_dto_1.GeneralUserScehema.safeParse(req.body);
            if (!validation.success) {
                throw new http_error_1.HttpError(validation.error.issues[0].message, 400);
            }
            const user = await this.adminService.createUser(validation.data);
            return res.status(201).json({
                success: true,
                message: "User created successfully",
                data: user,
            });
        };
        this.updateUser = async (req, res) => {
            const { id } = req.params;
            const data = req.body;
            const updatedUser = await this.adminService.updateUser(id, data);
            return res.json({ success: true, data: updatedUser });
        };
        this.deleteUser = async (req, res) => {
            const { id } = req.params;
            await this.adminService.deleteUser(id);
            return res.json({ success: true, message: "User deleted successfully" });
        };
        this.getUserById = async (req, res) => {
            const { id } = req.params;
            const user = await this.adminService.getUserById(id);
            return res.json({
                success: true,
                data: user,
            });
        };
        this.updateUserByAdminById = async (req, res) => {
            const { id } = req.params;
            const validation = user_dto_1.UpdateUserByAdminSchema.safeParse(req.body);
            if (!validation.success) {
                throw new http_error_1.HttpError(validation.error.issues[0].message, 400);
            }
            const updatedUser = await this.adminService.updateUserDetailsByAdmin(id, validation.data);
            return res.json({ success: true, data: updatedUser });
        };
    }
}
exports.AdminController = AdminController;
