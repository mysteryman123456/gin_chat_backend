import mongoose, { Schema } from "mongoose";
import { MessageType } from "../dtos/message.dto";

const MessageSchema = new Schema<MessageType>(
  {
    conversation_id: { type: Schema.Types.ObjectId },
    sender_id: { type: Schema.Types.ObjectId },
    type: {
      type: String,
      enum: ["TEXT", "VIDEO", "IMAGE", "AUDIO", "FILE"],
      default: "TEXT",
      required: true,
    },
    content: { type: String, required: false },
    file_url: { type: String, required: false },
  },
  { timestamps: true, collection: "messages" }
);

export const MessageModel = mongoose.model("Messages", MessageSchema);
