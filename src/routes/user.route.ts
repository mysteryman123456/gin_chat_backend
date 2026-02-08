import e from "express";
import { UserController } from "../controllers/user.controller";

const userRoute = e.Router();

const userController = new UserController();

userRoute.patch("/profile/:id", userController.updateProfile);
userRoute.get("/:user", userController.getSearchedUser);

export default userRoute;
