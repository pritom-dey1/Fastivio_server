import express from "express";
import {
  getAllEvents,
  getManagerEvents,
  getMemberEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventsByClub
} from "../Controllers/eventController.js";

import { verifyJWT, verifyRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(verifyJWT);

// Admin: get all events
router.get("/", verifyRole("admin"), getAllEvents);

// ClubManager: get their events
router.get("/manager", verifyRole("clubManager"), getManagerEvents);

// Member: get all events (for browsing/register)
router.get("/member", verifyRole("member"), getMemberEvents);

// ClubManager: create event
router.post("/", verifyRole("clubManager"), createEvent);

// ClubManager: update event
router.put("/:id", verifyRole("clubManager"), updateEvent);

// ClubManager: delete event
router.delete("/:id", verifyRole("clubManager"), deleteEvent);
router.get("/club/:clubId", verifyRole("member"), getEventsByClub);

export default router;
