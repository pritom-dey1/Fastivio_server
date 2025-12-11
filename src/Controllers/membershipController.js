// controllers/membershipController.js
import Membership from "../models/Membership.js";

// Get all memberships (Admin only)
export const getAllMemberships = async (req, res) => {
  try {
    const memberships = await Membership.find().populate("clubId", "clubName");
    res.json(memberships);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get memberships of logged-in user
export const getUserMemberships = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const memberships = await Membership.find({ userId }).populate("clubId");
    res.json(memberships);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create membership (Admin / ClubManager / Member)
// Create membership (Admin / ClubManager / Member)
export const createMembership = async (req, res) => {
  try {
    const { userId, clubId, status, paymentId } = req.body;

    if (!userId || !clubId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const joinedAt = new Date();
    const expiresAt = new Date(joinedAt);
    expiresAt.setMonth(expiresAt.getMonth() + 3); 
    const membership = await Membership.create({
      userId,
      clubId,
      status: status || "active",
      paymentId,
      joinedAt,
      expiresAt
    });

    res.status(201).json(membership);
  } catch (err) {
    console.error("CREATE MEMBERSHIP ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// Update membership status (Admin or ClubManager)
export const updateMembership = async (req, res) => {
  try {
    const membership = await Membership.findById(req.params.id);
    if (!membership) return res.status(404).json({ error: "Membership not found" });

    const { status, expiresAt } = req.body;
    if (status) membership.status = status;
    if (expiresAt) membership.expiresAt = expiresAt;

    await membership.save();
    res.json(membership);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete membership (Admin only)
export const deleteMembership = async (req, res) => {
  try {
    const membership = await Membership.findByIdAndDelete(req.params.id);
    if (!membership) return res.status(404).json({ error: "Membership not found" });

    res.json({ message: "Membership deleted" });
  } catch (err) {
    console.error("DELETE MEMBERSHIP ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
