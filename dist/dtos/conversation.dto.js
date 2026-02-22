"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddUserInGroupSchema = exports.ConversationSchema = exports.objectIdSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const mongoose_1 = require("mongoose");
//
exports.objectIdSchema = zod_1.default
    .string()
    .trim()
    .refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId format",
})
    .transform((val) => new mongoose_1.Types.ObjectId(val));
//
exports.ConversationSchema = zod_1.default.object({
    type: zod_1.default.enum(["GROUP", "SINGLE"], {
        message: "Conversation type should be either group or single",
    }),
    user_id: exports.objectIdSchema,
    group_name: zod_1.default.string().nullable().optional(),
    created_by: exports.objectIdSchema,
    participants: zod_1.default.array(exports.objectIdSchema),
});
//
exports.AddUserInGroupSchema = zod_1.default.object({
    user_id: zod_1.default.array(exports.objectIdSchema),
    conversation_id: exports.objectIdSchema,
});
