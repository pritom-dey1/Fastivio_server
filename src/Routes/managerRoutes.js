import express from "express"
import { verifyJWT, verifyRole } from "../middleware/authMiddleware.js"
import Club from "../models/Club.js"
import Membership from "../models/Membership.js"
import Event from "../models/Event.js"
import Payment from "../models/Payment.js"
import EventRegistration from "../models/EventRegistration.js"

const router = express.Router()

// All Manager routes require JWT + clubManager role
router.use(verifyJWT, verifyRole("clubManager"))

/* =============================
   MANAGER OVERVIEW
============================= */
router.get("/overview", async (req, res) => {
  try {
    const managerId = req.user._id
    const clubs = await Club.find({ managerId })

    const clubIds = clubs.map(c => c._id)

    const totalMembers = await Membership.countDocuments({ clubId: { $in: clubIds } })
    const totalEvents = await Event.countDocuments({ clubId: { $in: clubIds } })

    const payments = await Payment.aggregate([
      { $match: { clubId: { $in: clubIds } } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ])

    res.json({
      totalClubs: clubs.length,
      totalMembers,
      totalEvents,
      totalPayments: payments[0]?.total || 0
    })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

/* =============================
   CLUB CRUD
============================= */
router.get("/clubs", async (req, res) => {
  try {
    const clubs = await Club.find({ managerId: req.user._id }).sort({ createdAt: -1 })
    res.json(clubs)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.post("/clubs", async (req, res) => {
  try {
    const club = await Club.create({
      ...req.body,
      managerId: req.user._id
    })
    res.json(club)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

router.put("/clubs/:id", async (req, res) => {
  try {
    const club = await Club.findOneAndUpdate(
      { _id: req.params.id, managerId: req.user._id },
      req.body,
      { new: true }
    )

    if (!club) return res.status(404).json({ error: "Not allowed" })

    res.json(club)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

router.delete("/clubs/:id", async (req, res) => {
  try {
    const club = await Club.findOneAndDelete({
      _id: req.params.id,
      managerId: req.user._id
    })

    if (!club) return res.status(404).json({ error: "Not allowed" })

    // Cleanup related data
    await Membership.deleteMany({ clubId: club._id })
    await Event.deleteMany({ clubId: club._id })
    await EventRegistration.deleteMany({ clubId: club._id })

    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

/* =============================
   CLUB MEMBERS
============================= */
router.get("/clubs/:id/members", async (req, res) => {
  try {
    const club = await Club.findOne({
      _id: req.params.id,
      managerId: req.user._id
    })

    if (!club) return res.status(403).json({ error: "Not allowed" })

    const members = await Membership.find({ clubId: club._id }).populate("userId")

    res.json(members)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.patch("/membership/:id/status", async (req, res) => {
  try {
    const membership = await Membership.findById(req.params.id).populate("clubId")

    if (!membership) return res.status(404).json({ error: "Invalid membership" })

    if (membership.clubId.managerId.toString() !== req.user._id.toString())
      return res.status(403).json({ error: "Not allowed" })

    membership.status = req.body.status
    await membership.save()

    res.json(membership)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

/* =============================
   EVENTS CRUD
============================= */
router.get("/events/:clubId", async (req, res) => {
  try {
    const club = await Club.findOne({
      _id: req.params.clubId,
      managerId: req.user._id
    })

    if (!club) return res.status(403).json({ error: "Not allowed" })

    const events = await Event.find({ clubId: club._id }).sort({ createdAt: -1 })

    res.json(events)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.post("/events/:clubId", async (req, res) => {
  try {
    const club = await Club.findOne({
      _id: req.params.clubId,
      managerId: req.user._id
    })

    if (!club) return res.status(403).json({ error: "Not allowed" })

    const event = await Event.create({ ...req.body, clubId: club._id })

    res.json(event)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

router.put("/events/edit/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("clubId")

    if (!event) return res.status(404).json({ error: "Invalid event" })

    if (event.clubId.managerId.toString() !== req.user._id.toString())
      return res.status(403).json({ error: "Not allowed" })

    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true })

    res.json(updated)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

router.delete("/events/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("clubId")

    if (!event) return res.status(404).json({ error: "Invalid event" })

    if (event.clubId.managerId.toString() !== req.user._id.toString())
      return res.status(403).json({ error: "Not allowed" })

    await Event.findByIdAndDelete(req.params.id)

    // Delete related registrations
    await EventRegistration.deleteMany({ eventId: event._id })

    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

/* =============================
   PAYMENT HISTORY
============================= */
router.get("/payments/:clubId", async (req, res) => {
  try {
    const club = await Club.findOne({
      _id: req.params.clubId,
      managerId: req.user._id
    })

    if (!club) return res.status(403).json({ error: "Not allowed" })

    const payments = await Payment.find({ clubId: club._id })
      .populate("userId")
      .sort({ createdAt: -1 })

    res.json(payments)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

/* =============================
   EVENT REGISTRATIONS
============================= */
router.get("/events/:eventId/registrations", async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId).populate("clubId")
    if (!event) return res.status(404).json({ error: "Event not found" })

    // Validate manager ownership
    if (event.clubId.managerId.toString() !== req.user._id.toString())
      return res.status(403).json({ error: "Not allowed" })

    // Fetch registrations
    const registrations = await EventRegistration.find({
      eventId: req.params.eventId
    }).sort({ createdAt: -1 })

    res.json(registrations)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
