import express from "express";
import { getMe, handleFirebaseAuth, logout, updateUser } from "../Controllers/authController.js";

const router = express.Router();

router.post("/firebase-login", handleFirebaseAuth);
router.post("/logout", logout);
router.get("/me", getMe);
router.put("/update", updateUser);

export default router;

