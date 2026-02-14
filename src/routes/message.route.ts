import e from "express";
import { MessageController } from "../controllers/message.controller";

const messageRoute = e.Router();

messageRoute.get("/:conversation_id", MessageController.getMessages);

export default messageRoute;
