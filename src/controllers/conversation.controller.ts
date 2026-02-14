import { Request, Response } from "express";
import { HttpError } from "../utils/http_error";
import {
  ConversationSchema,
  AddUserInGroupSchema,
} from "../dtos/conversation.dto";
import { ConversationService } from "../services/conversation.service";

export class ConversationController {
  private conversationService = new ConversationService();

  createConversation = async (req: Request, res: Response) => {
    const newData = {
      ...req.body,
      created_by: req.user?._id!,
      user_id: req?.body?.user_id!,
      participants: [req?.body?.user_id!, req.user?._id], // to whom to message , my session user id
    };
    console.log(newData);
    const validatedData = ConversationSchema.safeParse(newData);
    if (!validatedData.success)
      throw new HttpError(validatedData.error.issues[0].message, 400);
    await this.conversationService.createConversation(validatedData.data);
    return res.status(201).json({
      success: true,
      message: "Conversation created successfully",
    });
  };

  addUserInGroup = async (req: Request, res: Response) => {
    const validatedData = AddUserInGroupSchema.safeParse(req.body);
    if (!validatedData.success)
      throw new HttpError(validatedData.error.issues[0].message, 400);
    await this.conversationService.addUsersInGroupUsingConversationId(
      validatedData.data
    );
    return res.status(201).json({
      success: true,
      message: "Users successfully added to group",
    });
  };

  getAllUsersThatIHaveMessaged = async (req: Request, res: Response) => {
    const user_id = req.user?._id;
    //
    if (!user_id) throw new HttpError("User id not provided", 400);
    const messaged_users = await this.conversationService.getAllConversations(
      user_id
    );
    return res.status(201).json({ data: messaged_users, success: true });
  };
}
