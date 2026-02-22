"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("../controllers/admin.controller");
const adminRoutes = express_1.default.Router();
const adminController = new admin_controller_1.AdminController();
adminRoutes.get("/users", adminController.getAllUsers);
adminRoutes.post("/users", adminController.createUser);
adminRoutes.patch("/users/:id", adminController.updateUser);
adminRoutes.delete("/users/:id", adminController.deleteUser);
adminRoutes.get("/users/:id", adminController.getUserById);
adminRoutes.patch("/users/:id", adminController.updateUser);
exports.default = adminRoutes;
