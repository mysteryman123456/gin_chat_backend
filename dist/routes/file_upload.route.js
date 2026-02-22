"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const file_upload_controller_1 = require("../controllers/file_upload.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const upload_middleware_1 = require("../middleware/upload.middleware");
const fileUploadRoute = express_1.default.Router();
const uploadController = new file_upload_controller_1.FileUploadController();
fileUploadRoute.post("/file", auth_middleware_1.authMiddleware, upload_middleware_1.upload.single("file"), uploadController.uploadFile);
exports.default = fileUploadRoute;
