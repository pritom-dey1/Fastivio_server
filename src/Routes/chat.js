import express from "express"
import { handleChat } from "../controllers/chatController.js"
import { verifyFirebaseToken } from "../middleware/authMiddleware.js"
const router = express.Router()
router.post("/", verifyFirebaseToken, handleChat)
export default router
