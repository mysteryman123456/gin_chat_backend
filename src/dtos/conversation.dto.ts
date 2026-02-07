import z from "zod";
import { Types } from "mongoose";
//
export const objectIdSchema = z
  .string()
  .trim()
  .refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId format",
  })
  .transform((val) => new Types.ObjectId(val));
//
export const ConversationSchema = z.object({
  type: z.enum(["GROUP", "SINGLE"], {
    message: "Conversation type should be either group or single",
  }),
  user_id: objectIdSchema,
  group_name: z.string().nullable().optional(),
  created_by: objectIdSchema,
  participants: z.array(objectIdSchema),
});
//
export const AddUserInGroupSchema = z.object({
  user_id: z.array(objectIdSchema),
  conversation_id: objectIdSchema,
});
//
export type ConversationType = z.infer<typeof ConversationSchema>;
//
export type AddUserInGroupType = z.infer<typeof AddUserInGroupSchema>;
