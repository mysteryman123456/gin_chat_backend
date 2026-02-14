import z from "zod";
import { objectIdSchema } from "./conversation.dto";

export const MessageSchema = z.object({
  conversation_id: objectIdSchema,
  sender_id: objectIdSchema,
  type: z.enum(["TEXT", "VIDEO", "IMAGE", "AUDIO", "FILE"]),
  content: z.string().optional().nullable(),
  file_url: z.string().optional().nullable(),
});

export type MessageType = z.infer<typeof MessageSchema>;
