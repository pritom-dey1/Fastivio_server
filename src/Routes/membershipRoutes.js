import express from "express";
import {
  getAllMemberships,
  getUserMemberships,
  createMembership,
  updateMembership,
  deleteMembership
} from "../Controllers/membershipController.js";

import { verifyJWT, verifyRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(verifyJWT);

// Admin only: get all memberships
router.get("/", verifyRole("admin"), getAllMemberships);

// Logged-in user: get their own memberships
router.get("/me", getUserMemberships);

// Admin, ClubManager, or Member: create membership
router.post("/", verifyRole(["admin", "clubManager", "member"]), createMembership);

// Admin or ClubManager: update membership
router.put("/:id", verifyRole(["admin", "clubManager"]), updateMembership);

// Admin only: delete membership
router.delete("/:id", verifyRole("admin"), deleteMembership);

export default router;
