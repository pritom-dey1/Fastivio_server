import express from "express";
import { getMe, handleFirebaseAuth, logout, updateUser } from "../Controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Routes
router.post("/firebase-login", handleFirebaseAuth);
router.post("/logout", logout);

// Protected Routes
router.get("/me", authMiddleware, getMe);
router.put("/update", authMiddleware, updateUser);

export default router;
