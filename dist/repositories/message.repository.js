"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRepository = void 0;
const message_1 = require("../models/message");
class MessageRepository {
    static async createMessage(data) {
        await message_1.MessageModel.create({ ...data });
    }
    static async getMessagesByConversationId(conversationId) {
        const messsages = await message_1.MessageModel.find({
            conversation_id: conversationId,
        })
            .select("content file_url sender_id type createdAt")
            .sort({ createdAt: -1 })
            .limit(20);
        return messsages.reverse();
    }
}
exports.MessageRepository = MessageRepository;
