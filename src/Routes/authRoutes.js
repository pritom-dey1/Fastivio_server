import express from "express";
import { getMe, handleFirebaseAuth, logout } from "../controllers/authController.js";

const router = express.Router();

router.post("/firebase-login", handleFirebaseAuth);
router.post("/logout", logout);
router.get("/me", getMe);
export default router;

