import { Request, Response } from "express";
import { HttpError } from "../utils/http_error";

export class ImageUploadController {
  uploadImage = async (req: Request, res: Response) => {
    const uploaded_file = req.file;
    if (!uploaded_file) throw new HttpError("Please upload a valid file", 400);
    console.log(req.user);
    if (!req.user?._id) throw new HttpError("User not authorized", 401);
    return res.status(200).json({
      success: true,
      data: {
        image_url: req.file?.path || null,
      },
    });
  };
}
