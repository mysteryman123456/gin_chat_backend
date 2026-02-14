import { Request, Response } from "express";
import { HttpError } from "../utils/http_error";

export type FileType = "AUDIO" | "VIDEO" | "FILE" | "IMAGE" | "TEXT";

export class FileUploadController {
  uploadFile = async (req: Request, res: Response) => {
    try {
      const file = req.file;
      if (!file) return res.status(400).send({ error: "File missing" });

      return res.status(200).send({
        success: true,
        data: {
          file_url: file.path,
        },
      });
    } catch {
      throw new HttpError("Failed to upload file", 400);
    }
  };
}
