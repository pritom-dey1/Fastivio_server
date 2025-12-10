import express from "express"
import { verifyJWT, verifyRole } from "../middleware/authMiddleware.js"
import Membership from "../models/Membership.js"
import EventRegistration from "../models/EventRegistration.js"
import Event from "../models/Event.js"
import Payment from "../models/Payment.js"
import Club from "../models/Club.js"

const router = express.Router()
router.use(verifyJWT, verifyRole("member"))

router.get("/overview", async (req, res) => {
  try {
    const userId = req.user._id
    const memberships = await Membership.find({ userId, status: "active" })
    const registered = await EventRegistration.find({ userId })
    const eventIds = registered.map(e => e.eventId)
    const upcomingEvents = await Event.find({
      _id: { $in: eventIds },
      eventDate: { $gte: new Date() }
    }).sort({ eventDate: 1 })
    res.json({
      totalClubsJoined: memberships.length,
      totalEventsRegistered: registered.length,
      upcomingEvents
    })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.get("/my-clubs", async (req, res) => {
  try {
    const userId = req.user._id
    const memberships = await Membership.find({ userId }).populate("clubId")
    res.json(memberships)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.get("/my-events", async (req, res) => {
  try {
    const userId = req.user._id
    const registrations = await EventRegistration.find({ userId }).populate("eventId")
    res.json(registrations)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.get("/payments", async (req, res) => {
  try {
    const userId = req.user._id
    const payments = await Payment.find({ userId }).sort({ createdAt: -1 })
    res.json(payments)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
