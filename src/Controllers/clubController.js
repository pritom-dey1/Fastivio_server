import Club from "../models/Club.js";
import User from "../models/User.js";

// Create a new club (Club Manager)
export const createClub = async (req, res) => {
  try {
    const { clubName, description, category, location, bannerImage, membershipFee } = req.body;

    if (req.user.role !== "clubManager") {
      return res.status(403).json({ error: "Only club managers can create clubs" });
    }

    const newClub = await Club.create({
      clubName,
      description,
      category,
      location,
      bannerImage,
      membershipFee: membershipFee || 0,
      status: "pending",
      managerId: req.user.id,
    });

    res.status(201).json(newClub);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all clubs (Admin / Member / Manager)
// Get all clubs (with search, filter, sort)
export const getClubs = async (req, res) => {
  try {
    // Only approved clubs will show to public
    const query = { status: "approved" };

    // Category filter
    if (req.query.category) query.category = req.query.category;

    // Search filter
    if (req.query.search) {
      query.clubName = { $regex: req.query.search, $options: "i" };
    }

    // Fetch filtered clubs
    let clubs = await Club.find(query);

    // Sorting
    if (req.query.sort === "newest") clubs.sort((a, b) => b.createdAt - a.createdAt);
    else if (req.query.sort === "oldest") clubs.sort((a, b) => a.createdAt - b.createdAt);
    else if (req.query.sort === "highestFee") clubs.sort((a, b) => b.membershipFee - a.membershipFee);
    else if (req.query.sort === "lowestFee") clubs.sort((a, b) => a.membershipFee - b.membershipFee);

    res.json(clubs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single club by ID
export const getClubById = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id).populate("managerId", "name email");
    if (!club) return res.status(404).json({ error: "Club not found" });

    res.json(club);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update club details (Club Manager or Admin)
export const updateClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ error: "Club not found" });

    if (req.user.role !== "admin" && !club.managerId.equals(req.user.id)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    Object.assign(club, req.body);
    await club.save();

    res.json(club);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: approve or reject club
export const changeClubStatus = async (req, res) => {
  try {
    const { status } = req.body; // pending / approved / rejected
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ error: "Club not found" });

    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admin can change club status" });
    }

    club.status = status;
    await club.save();

    res.json(club);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete club (Club Manager or Admin)
export const deleteClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ error: "Club not found" });

    if (req.user.role !== "admin" && !club.managerId.equals(req.user.id)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await club.remove();
    res.json({ message: "Club deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
