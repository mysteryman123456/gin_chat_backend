import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../config/cloudinary";
import { HttpError } from "../utils/http_error";

export type FileType = "AUDIO" | "VIDEO" | "FILE" | "IMAGE" | "TEXT";

const fileFormats: Record<FileType, string[]> = {
  IMAGE: ["jpg", "png", "jpeg", "webp"],
  VIDEO: ["mp4", "mov", "avi", "mkv"],
  AUDIO: ["mp3", "wav", "aac", "mpeg"],
  FILE: ["pdf", "doc", "docx", "txt", "csv", "plain", "zip"],
  TEXT: ["txt"],
};

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_, file) => {
    const ext = file.mimetype.split("/").pop()?.toLowerCase();
    if (!ext) {
      throw new HttpError("Invalid file type", 400);
    }

    const isValid = Object.values(fileFormats).some((formats) =>
      formats.includes(ext)
    );

    if (!isValid) {
      throw new HttpError("Invalid file type", 400);
    }

    return {
      resource_type: file.mimetype.startsWith("video") ? "video" : "auto",
    };
  },
});

export const upload = multer({ storage });
