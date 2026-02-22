"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const userRoute = express_1.default.Router();
const userController = new user_controller_1.UserController();
userRoute.patch("/profile/:id", auth_middleware_1.authMiddleware, userController.updateProfile);
userRoute.get("/:user", auth_middleware_1.authMiddleware, userController.getSearchedUser);
userRoute.patch("/settings/password", auth_middleware_1.authMiddleware, userController.updatePassword);
exports.default = userRoute;
