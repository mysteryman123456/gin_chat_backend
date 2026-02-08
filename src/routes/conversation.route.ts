import { Router } from "express";
import { ConversationController } from "../controllers/conversation.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const controller = new ConversationController();

router.post("/", authMiddleware, controller.createConversation);
router.get("/", authMiddleware, controller.getAllUsersThatIHaveMessaged);
router.post("/add-members", authMiddleware, controller.addUserInGroup);

export default router;
