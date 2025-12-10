import express from "express";
import {
  createClub,
  getClubs,
  getClubById,
  updateClub,
  changeClubStatus,
  deleteClub,
  
} from "../Controllers/clubController.js";
import {verifyRole } from "../middleware/authMiddleware.js";

const router = express.Router();



// Member can view approved clubs
router.get("/", getClubs);
router.get("/:id", getClubById);

// Club Manager creates club
router.post("/", verifyRole("clubManager"), createClub);

// Club Manager or Admin updates club
router.put("/:id", updateClub);

// Admin approves/rejects club
router.patch("/:id/status", verifyRole("admin"), changeClubStatus);

// Delete club
router.delete("/:id", deleteClub);

export default router;
