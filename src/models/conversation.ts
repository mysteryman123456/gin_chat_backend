import mongoose, { Schema } from "mongoose";
//
const ConversationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["SINGLE", "GROUP"],
      required: true,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    group_name: {
      type: String,
      default: null,
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  { timestamps: true, collection: "conversation" }
);
//
ConversationSchema.index(
  { type: 1, participants: 1 },
  { unique: true, partialFilterExpression: { type: "SINGLE" } }
);
//
export const ConversationModel = mongoose.model(
  "Conversation",
  ConversationSchema
);
//
