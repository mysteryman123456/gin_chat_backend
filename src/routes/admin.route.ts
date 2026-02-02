import express from "express";
import { AdminController } from "../controllers/admin.controller";

const adminRoutes = express.Router();
const adminController = new AdminController();

adminRoutes.get("/users", adminController.getAllUsers);
adminRoutes.post("/users", adminController.createUser);
adminRoutes.patch("/users/:id", adminController.updateUser);
adminRoutes.delete("/users/:id", adminController.deleteUser);

export default adminRoutes;
