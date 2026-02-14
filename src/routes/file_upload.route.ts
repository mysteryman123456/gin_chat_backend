import e from "express";
import { FileUploadController } from "../controllers/file_upload.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";

const fileUploadRoute = e.Router();
const uploadController = new FileUploadController();
fileUploadRoute.post(
  "/file",
  authMiddleware,
  upload.single("file"),
  uploadController.uploadFile
);

export default fileUploadRoute;
