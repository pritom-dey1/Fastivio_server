import express from "express"
import { verifyJWT, verifyRole } from "../middleware/authMiddleware.js"
import Membership from "../models/Membership.js"
import EventRegistration from "../models/EventRegistration.js"
import Event from "../models/Event.js"
import Payment from "../models/Payment.js"

const router = express.Router()

// Only members can access
router.use(verifyJWT, verifyRole("member"))

/* ============================
   GET: Member Overview (userId based)
   ============================ */
router.get("/overview", async (req, res) => {
  try {
    const userId = req.user._id

    const memberships = await Membership.find({ userId, status: "active" })
    const registered = await EventRegistration.find({ userId })

    const eventIds = registered.map(e => e.eventId)

    const upcomingEvents = await Event.find({
      _id: { $in: eventIds },
      eventDate: { $gte: new Date() }
    })
      .populate("clubId", "clubName location")
      .sort({ eventDate: 1 })

    res.json({
      totalClubsJoined: memberships.length,
      totalEventsRegistered: registered.length,
      upcomingEvents
    })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

/* ============================
   GET: My Clubs (userId based)
   ============================ */
router.get("/my-clubs", async (req, res) => {
  try {
    const userId = req.user._id

    const memberships = await Membership.find({ userId })
      .populate("clubId", "clubName location")

    res.json(memberships)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

/* ============================
   GET: My Events (userId based)
   ============================ */
router.get("/my-events", async (req, res) => {
  try {
    const userId = req.user._id

    const registrations = await EventRegistration.find({ userId })
      .populate({
        path: "eventId",
        populate: { path: "clubId", select: "clubName location" }
      })

    res.json(registrations)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

/* ============================
   GET: Payment History (userId based)
   ============================ */
router.get("/payments", async (req, res) => {
  try {
    const userId = req.user._id

    const payments = await Payment.find({ userId })
      .populate("clubId", "clubName")
      .sort({ createdAt: -1 })

    res.json(payments)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
