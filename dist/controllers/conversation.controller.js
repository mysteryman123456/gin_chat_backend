"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationController = void 0;
const http_error_1 = require("../utils/http_error");
const conversation_dto_1 = require("../dtos/conversation.dto");
const conversation_service_1 = require("../services/conversation.service");
class ConversationController {
    constructor() {
        this.conversationService = new conversation_service_1.ConversationService();
        this.createConversation = async (req, res) => {
            const newData = {
                ...req.body,
                created_by: req.user?._id,
                user_id: req?.body?.user_id,
                participants: [req?.body?.user_id, req.user?._id], // to whom to message , my session user id
            };
            console.log(newData);
            const validatedData = conversation_dto_1.ConversationSchema.safeParse(newData);
            if (!validatedData.success)
                throw new http_error_1.HttpError(validatedData.error.issues[0].message, 400);
            await this.conversationService.createConversation(validatedData.data);
            return res.status(201).json({
                success: true,
                message: "Conversation created successfully",
            });
        };
        this.addUserInGroup = async (req, res) => {
            const validatedData = conversation_dto_1.AddUserInGroupSchema.safeParse(req.body);
            if (!validatedData.success)
                throw new http_error_1.HttpError(validatedData.error.issues[0].message, 400);
            await this.conversationService.addUsersInGroupUsingConversationId(validatedData.data);
            return res.status(201).json({
                success: true,
                message: "Users successfully added to group",
            });
        };
        this.getAllUsersThatIHaveMessaged = async (req, res) => {
            const user_id = req.user?._id;
            //
            if (!user_id)
                throw new http_error_1.HttpError("User id not provided", 400);
            const messaged_users = await this.conversationService.getAllConversations(user_id);
            return res.status(201).json({ data: messaged_users, success: true });
        };
    }
}
exports.ConversationController = ConversationController;
