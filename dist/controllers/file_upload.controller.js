"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadController = void 0;
const http_error_1 = require("../utils/http_error");
class FileUploadController {
    constructor() {
        this.uploadFile = async (req, res) => {
            try {
                const file = req.file;
                if (!file)
                    return res.status(400).send({ error: "File missing" });
                return res.status(200).send({
                    success: true,
                    data: {
                        file_url: file.path,
                    },
                });
            }
            catch {
                throw new http_error_1.HttpError("Failed to upload file", 400);
            }
        };
    }
}
exports.FileUploadController = FileUploadController;
