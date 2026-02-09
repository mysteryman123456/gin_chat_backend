import { MessageRepository } from "../repositories/message.repository";

export class MessageService {
  static async getMessages(conversationId: string) {
    if (!conversationId) {
      throw new Error("Conversation ID is required");
    }

    return MessageRepository.getMessagesByConversationId(conversationId);
  }
}
