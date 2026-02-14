import { AddUserInGroupType, ConversationType } from "../dtos/conversation.dto";
import { ConversationRepository } from "../repositories/conversation.repository";

export class ConversationService {
  private conversationRepo = new ConversationRepository();

  async createConversation(data: ConversationType): Promise<void> {
    return await this.conversationRepo.createConversation(data);
  }

  async addUsersInGroupUsingConversationId(
    data: AddUserInGroupType
  ): Promise<void> {
    return await this.conversationRepo.addUsersInGroupUsingConversationId(data);
  }

  async getAllConversations(created_by: string) {
    return await this.conversationRepo.getAllConversationForMyUserId(
      created_by
    );
  }
}
