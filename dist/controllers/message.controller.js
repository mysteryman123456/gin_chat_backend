"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageController = void 0;
const message_service_1 = require("../services/message.service");
class MessageController {
    static async getMessages(req, res) {
        const conversation_id = req.params.conversation_id;
        const messages = await message_service_1.MessageService.getMessages(conversation_id);
        return res.status(200).json({
            success: true,
            data: messages,
        });
    }
}
exports.MessageController = MessageController;
