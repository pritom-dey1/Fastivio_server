import express from "express"
import { verifyJWT, verifyRole } from "../middleware/authMiddleware.js"
import User from "../models/User.js"
import Club from "../models/Club.js"
import Membership from "../models/Membership.js"
import Event from "../models/Event.js"
import Payment from "../models/Payment.js"

const router = express.Router()

// 🔐 Admin-only Access
router.use(verifyJWT, verifyRole("admin"))

    // ADMIN OVERVIEW (Dashboard Summary)
router.get("/overview", async (req, res) => {
  try {
    const [
      totalUsers,
      totalClubs,
      totalMemberships,
      totalEvents,
      payments
    ] = await Promise.all([
      User.countDocuments(),
      Club.countDocuments(),
      Membership.countDocuments(),
      Event.countDocuments(),
      Payment.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }])
    ])

    const totalPayments = payments[0]?.total || 0

    res.json({
      totalUsers,
      totalClubs,
      totalMemberships,
      totalEvents,
      totalPayments
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

  //  Pagination Helper (DRY)
const paginate = (query, page, limit) => {
  const skip = (page - 1) * limit
  return query.skip(skip).limit(limit)
}


  // MANAGE USERS (List)
router.get("/users", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    const query = User.find().sort({ createdAt: -1 })

    const users = await paginate(query, page, limit)
    const total = await User.countDocuments()

    res.json({
      data: users,
      page,
      totalPages: Math.ceil(total / limit),
      total
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// UPDATE USER ROLE
router.patch("/users/:id/role", async (req, res) => {
  try {
    const { role } = req.body
    const allowed = ["admin", "clubManager", "member"]

    if (!allowed.includes(role))
      return res.status(400).json({ error: "Invalid role" })

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    )

    if (!updated) return res.status(404).json({ error: "User not found" })

    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

  // MANAGE CLUBS (List + Filter)
router.get("/clubs", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filter = {};

    if (req.query.status) filter.status = req.query.status;

    const query = Club.find(filter).sort({ createdAt: -1 });
    const clubs = await paginate(query, page, limit);

    const clubsWithCounts = await Promise.all(
      clubs.map(async (club) => {
        const membersCount = await Membership.countDocuments({ clubId: club._id });
        const eventsCount = await Event.countDocuments({ clubId: club._id });

        return {
          ...club._doc,
          membersCount,
          eventsCount,
          managerEmail: club.managerEmail || "N/A",
        };
      })
    );

    const total = await Club.countDocuments(filter);

    res.json({
      data: clubsWithCounts,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// UPDATE CLUB STATUS (approve / reject)
router.patch("/clubs/:id/status", async (req, res) => {
  try {
    const { status } = req.body
    const allowed = ["pending", "approved", "rejected"]

    if (!allowed.includes(status))
      return res.status(400).json({ error: "Invalid status" })

    const updated = await Club.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )

    if (!updated) return res.status(404).json({ error: "Club not found" })

    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

//  PAYMENTS TABLE (with relations)
router.get("/payments", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    const query = Payment.find()
      .populate("userId", "name email")
      .populate("clubId", "clubName")
      .populate("eventId", "title")
      .sort({ createdAt: -1 })

    const payments = await paginate(query, page, limit)
    const total = await Payment.countDocuments()

    res.json({
      data: payments,
      page,
      totalPages: Math.ceil(total / limit),
      total
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
