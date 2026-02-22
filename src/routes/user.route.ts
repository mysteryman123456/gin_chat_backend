import e from "express";
import { UserController } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const userRoute = e.Router();

const userController = new UserController();

userRoute.patch("/profile/:id", authMiddleware,userController.updateProfile);
userRoute.get("/:user",authMiddleware, userController.getSearchedUser);
userRoute.patch("/settings/password",authMiddleware ,userController.updatePassword);

export default userRoute;
