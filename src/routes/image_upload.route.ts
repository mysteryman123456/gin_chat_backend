import e from "express";
import { ImageUploadController } from "../controllers/image_upload.controller";
import upload from "../middleware/upload.middleware";
import { authMiddleware } from "../middleware/auth.middleware";

const imageUploadRoute = e.Router();
const uploadController = new ImageUploadController();
imageUploadRoute.post(
  "/image",
  authMiddleware,
  upload.single("image"),
  uploadController.uploadImage
);

export default imageUploadRoute;
