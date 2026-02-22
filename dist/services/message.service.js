"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageService = void 0;
const message_repository_1 = require("../repositories/message.repository");
class MessageService {
    static async getMessages(conversationId) {
        if (!conversationId) {
            throw new Error("Conversation ID is required");
        }
        return message_repository_1.MessageRepository.getMessagesByConversationId(conversationId);
    }
}
exports.MessageService = MessageService;
