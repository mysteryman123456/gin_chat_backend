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
    socket.on("call_user", ({ conversationId, callerId, callerName }) => {
      socket.to(conversationId).emit("incoming_call", {
        conversationId,
        callerId,
        callerName,
      });
    });

    socket.on("call_accepted", ({ conversationId }) => {
      socket.to(conversationId).emit("call_accepted", { conversationId });
    });

    socket.on("call_rejected", ({ conversationId }) => {
      socket.to(conversationId).emit("call_rejected", { conversationId });
    });

    socket.on("call_ended", ({ conversationId }) => {
      socket.to(conversationId).emit("call_ended", { conversationId });
    });

    socket.on("offer", ({ offer, conversationId }) => {
      socket.to(conversationId).emit("offer", offer);
    });

    socket.on("answer", ({ answer, conversationId }) => {
      socket.to(conversationId).emit("answer", answer);
    });

    socket.on("ice-candidate", ({ candidate, conversationId }) => {
      socket.to(conversationId).emit("ice-candidate", candidate);
    });

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
