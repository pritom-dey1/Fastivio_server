import express from "express"
import { onboardUser, getProfile } from "../controllers/userController.js"
import { verifyFirebaseToken } from "../middleware/authMiddleware.js"
const router = express.Router()
router.post("/onboard", verifyFirebaseToken, onboardUser)
router.get("/profile", verifyFirebaseToken, getProfile)
export default router
