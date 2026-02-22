"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const http_error_1 = require("../utils/http_error");
const fileFormats = {
    IMAGE: ["jpg", "png", "jpeg", "webp"],
    VIDEO: ["mp4", "mov", "avi", "mkv"],
    AUDIO: ["mp3", "wav", "aac", "mpeg"],
    FILE: ["pdf", "doc", "docx", "txt", "csv", "plain", "zip"],
    TEXT: ["txt"],
};
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.default,
    params: async (_, file) => {
        const ext = file.mimetype.split("/").pop()?.toLowerCase();
        if (!ext) {
            throw new http_error_1.HttpError("Invalid file type", 400);
        }
        const isValid = Object.values(fileFormats).some((formats) => formats.includes(ext));
        if (!isValid) {
            throw new http_error_1.HttpError("Invalid file type", 400);
        }
        return {
            resource_type: file.mimetype.startsWith("video") ? "video" : "auto",
        };
    },
});
exports.upload = (0, multer_1.default)({ storage });
