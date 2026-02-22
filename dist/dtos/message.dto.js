"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const conversation_dto_1 = require("./conversation.dto");
exports.MessageSchema = zod_1.default.object({
    conversation_id: conversation_dto_1.objectIdSchema,
    sender_id: conversation_dto_1.objectIdSchema,
    type: zod_1.default.enum(["TEXT", "VIDEO", "IMAGE", "AUDIO", "FILE"]),
    content: zod_1.default.string().optional().nullable(),
    file_url: zod_1.default.string().optional().nullable(),
});
