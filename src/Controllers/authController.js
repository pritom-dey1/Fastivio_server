import admin from "../config/firebase.js";
import User from "../models/User.js";

/**
 * Handle Firebase login
 * Input: { firebaseToken }
 * Returns: backend user object
 */
export const handleFirebaseAuth = async (req, res) => {
  try {
    const { firebaseToken } = req.body;

    if (!firebaseToken) {
      return res.status(400).json({ error: "No Firebase token provided" });
    }

    // Verify Firebase token
    const decoded = await admin.auth().verifyIdToken(firebaseToken);
    const firebaseUser = await admin.auth().getUser(decoded.uid);

    const name = firebaseUser.displayName || "Unnamed";
    const email = firebaseUser.email;
    const photoURL = firebaseUser.photoURL || "";

    if (!email) {
      return res.status(400).json({ error: "Firebase email missing" });
    }

    // Find or create backend user
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        photoURL,
        role: "member",
      });
    }

    // Return backend user (no cookies, no JWT)
    return res.json({ user });

  } catch (err) {
    console.error("handleFirebaseAuth error:", err);
    return res.status(400).json({ error: err.message });
  }
};

/**
 * Get current user
 * Protected route → authMiddleware provides req.user
 */
export const getMe = async (req, res) => {
  try {
    const email = req.user.email;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ user: null });

    return res.json({ user });
  } catch (err) {
    console.error("getMe error:", err);
    return res.status(500).json({ user: null });
  }
};

/**
 * Logout route (optional)
 * Since no cookie/JWT, frontend can just clear local state
 */
export const logout = (req, res) => {
  return res.json({ message: "Logged out" });
};

/**
 * Update user profile
 * Protected route → authMiddleware provides req.user
 */
export const updateUser = async (req, res) => {
  try {
    const email = req.user.email;

    const updated = await User.findOneAndUpdate(
      { email },
      {
        name: req.body.name,
        photoURL: req.body.photoURL,
      },
      { new: true }
    );

    return res.json({ user: updated });
  } catch (err) {
    console.error("updateUser error:", err);
    return res.status(500).json({ error: err.message });
  }
};
