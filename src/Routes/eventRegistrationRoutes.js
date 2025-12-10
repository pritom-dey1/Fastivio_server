import express from "express";
import {
  registerForEvent,
  cancelRegistration,
  getEventRegistrations,
  getMyRegistrations
} from "../Controllers/eventRegistrationController.js";

import { verifyJWT, verifyRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyJWT);

// Member: register for an event
router.post("/", verifyRole("member"), registerForEvent);

// Member: cancel registration
router.put("/cancel/:id", verifyRole("member"), cancelRegistration);

// Member: get own registrations
router.get("/my", verifyRole("member"), getMyRegistrations);

// ClubManager: get registrations for an event
router.get("/event/:eventId", verifyRole("clubManager"), getEventRegistrations);

export default router;
