"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const message_controller_1 = require("../controllers/message.controller");
const messageRoute = express_1.default.Router();
messageRoute.get("/:conversation_id", message_controller_1.MessageController.getMessages);
exports.default = messageRoute;
