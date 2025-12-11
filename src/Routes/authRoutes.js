import express from "express";
import { getMe, handleFirebaseAuth, logout, updateUser } from "../Controllers/authController.js";
import { verifyJWT } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Routes
router.post("/firebase-login", handleFirebaseAuth);
router.post("/logout", logout);

// Protected Routes
router.get("/me", verifyJWT, getMe);
router.put("/update", verifyJWT, updateUser);

export default router;
