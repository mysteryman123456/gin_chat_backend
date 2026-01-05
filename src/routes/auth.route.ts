import e from "express";
import { AuthController } from "../controllers/auth.controller";

const authRoute = e.Router();

const authController = new AuthController();

authRoute.post("/login", authController.login);
authRoute.post("/signup", authController.signup);

export default authRoute;
