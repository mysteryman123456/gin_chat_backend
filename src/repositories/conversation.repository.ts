import { Types } from "mongoose";
import { AddUserInGroupType, ConversationType } from "../dtos/conversation.dto";
import { ConversationModel } from "../models/conversation";

interface MessagedUsers {
  users: {
    username: string;
    profile_image: string;
    _id: string;
  }[];
  group_name: string | null;
  type: "SINGLE" | "GROUP";
  conversation_id: string;
}

export class ConversationRepository {
  async createConversation(data: ConversationType): Promise<void> {
    const sortedIds = [data.created_by, data.user_id].sort();

    if (data.type === "SINGLE") {
      const existing = await ConversationModel.findOne({
        type: "SINGLE",
        participants: { $all: sortedIds, $size: 2 },
      });

      if (existing) return;
    }

    await ConversationModel.create({
      type: data.type,
      group_name: data.group_name,
      created_by: data.created_by,
      participants: sortedIds,
    });
  }

  async addUsersInGroupUsingConversationId(
    data: AddUserInGroupType
  ): Promise<void> {
    await ConversationModel.updateOne(
      { _id: data.conversation_id },
      { $addToSet: { participants: { $each: data.user_id } } }
    );
  }
  //

  async getAllConversationForMyUserId(
    my_user_id: string
  ): Promise<MessagedUsers[]> {
    const userId = new Types.ObjectId(my_user_id);

    const conversations = await ConversationModel.aggregate([
      // find conversations where this user is a participant
      { $match: { participants: userId } },

      // populate participants
      {
        $lookup: {
          from: "users",
          localField: "participants",
          foreignField: "_id",
          as: "user_details",
        },
      },

      // remove the current user from participants
      {
        $addFields: {
          user_details: {
            $filter: {
              input: "$user_details",
              as: "user",
              cond: { $ne: ["$$user._id", userId] },
            },
          },
        },
      },

      // remove conversations with no other participants
      { $match: { user_details: { $ne: [] } } },

      // for SINGLE conversations, pick only the first if duplicates exist
      {
        $group: {
          _id: {
            type: "$type",
            users: "$user_details._id",
          },
          conversation_id: { $first: "$_id" },
          type: { $first: "$type" },
          group_name: { $first: "$group_name" },
          users: { $first: "$user_details" },
        },
      },

      // final projection
      {
        $project: {
          _id: 0,
          conversation_id: { $toString: "$conversation_id" },
          type: 1,
          group_name: 1,
          users: {
            $map: {
              input: "$users",
              as: "user",
              in: {
                _id: { $toString: "$$user._id" },
                username: "$$user.username",
                profile_image: { $ifNull: ["$$user.profile_image", null] },
              },
            },
          },
        },
      },
    ]);

    return conversations;
  }

  //
}
