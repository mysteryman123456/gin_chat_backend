import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { MessageResponseType } from "./types/message";
import { MessageRepository } from "./repositories/message.repository";
import { Types } from "mongoose";

const onlineUsers = new Map<string, string>();

let io: Server | null = null;

export function initSocketServer(app: HttpServer) {
  io = new Server(app, {
    cors: {
      origin: [process.env.FRONTEND_URL!],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("join_online", ({ userId }) => {
      onlineUsers.set(userId, socket.id);
      // broadcast updated online list
      io?.emit("online_users", Array.from(onlineUsers.keys()));
    });

    socket.on("join_conversation", ({ conversationId }) => {
      socket.join(conversationId);
      ("");
    });

    socket.on("leave_conversation", ({ conversationId }) => {
      socket.leave(conversationId);
    });

    socket.on("send_message", (data: MessageResponseType) => {
      void MessageRepository.createMessage({
        ...data,
        conversation_id: new Types.ObjectId(data.conversation_id),
        sender_id: new Types.ObjectId(data.sender_id),
      });
      socket.to(data.conversation_id).emit("receive_message", data);
    });

    // web rtc

    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }

      io?.emit("online_users", Array.from(onlineUsers.keys()));
    });
  });

  return io;
}

export function getIO(): Server {
  if (!io) {
    throw new Error("Socket.io has not been initialized!");
  }
  return io;
}
