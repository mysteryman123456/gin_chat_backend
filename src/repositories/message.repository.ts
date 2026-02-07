import { MessageType } from "../dtos/message.dto";
import { MessageModel } from "../models/message";

export class MessageRepository {
  static async createMessage(data: MessageType): Promise<void> {
    await MessageModel.create({ ...data });
  }

  static async getMessagesByConversationId(conversationId: string) {
    const messsages = await MessageModel.find({
      conversation_id: conversationId,
    })
      .select("content file_url sender_id type createdAt")
      .sort({ createdAt: -1 })
      .limit(20);
    return messsages.reverse();
  }
}
