"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocketServer = initSocketServer;
exports.getIO = getIO;
const socket_io_1 = require("socket.io");
const message_repository_1 = require("./repositories/message.repository");
const mongoose_1 = require("mongoose");
const onlineUsers = new Map();
let io = null;
function initSocketServer(app) {
    io = new socket_io_1.Server(app, {
        cors: {
            origin: [process.env.FRONTEND_URL],
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
        socket.on("send_message", (data) => {
            void message_repository_1.MessageRepository.createMessage({
                ...data,
                conversation_id: new mongoose_1.Types.ObjectId(data.conversation_id),
                sender_id: new mongoose_1.Types.ObjectId(data.sender_id),
            });
            socket.to(data.conversation_id).emit("receive_message", data);
            const receiverSocketId = onlineUsers.get(data.receiver_info.receiver_id);
            if (receiverSocketId) {
                io?.to(receiverSocketId).emit("live_message", {
                    conversation_id: data.conversation_id,
                    type: data.type,
                    by: data.receiver_info.by,
                    content: data.content,
                });
            }
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
function getIO() {
    if (!io) {
        throw new Error("Socket.io has not been initialized!");
    }
    return io;
}
