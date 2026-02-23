import e from "express";
import { AuthController } from "../controllers/auth.controller";
//
const authRoute = e.Router();
//
const authController = new AuthController();
//
authRoute.post("/login", authController.login);
authRoute.post("/signup", authController.signup);
authRoute.get("/verify-token", authController.verifyToken);
authRoute.post("/forgot-password", authController.forgotPassword);
authRoute.post("/reset-password", authController.resetPassword);
//
export default authRoute;
