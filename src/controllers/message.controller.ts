import { Request, Response } from "express";
import { MessageService } from "../services/message.service";

export class MessageController {
  static async getMessages(req: Request, res: Response) {
    const conversation_id = req.params.conversation_id as string;

    const messages = await MessageService.getMessages(conversation_id);

    return res.status(200).json({
      success: true,
      data: messages,
    });
  }
}
