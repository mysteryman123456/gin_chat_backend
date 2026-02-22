"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationService = void 0;
const conversation_repository_1 = require("../repositories/conversation.repository");
class ConversationService {
    constructor() {
        this.conversationRepo = new conversation_repository_1.ConversationRepository();
    }
    async createConversation(data) {
        return await this.conversationRepo.createConversation(data);
    }
    async addUsersInGroupUsingConversationId(data) {
        return await this.conversationRepo.addUsersInGroupUsingConversationId(data);
    }
    async getAllConversations(created_by) {
        return await this.conversationRepo.getAllConversationForMyUserId(created_by);
    }
}
exports.ConversationService = ConversationService;
