import jwt from "jsonwebtoken";
import admin from "../config/firebase.js";
import User from "../models/User.js";

export const handleFirebaseAuth = async (req, res) => {
  try {
    const { firebaseToken } = req.body;

    const decoded = await admin.auth().verifyIdToken(firebaseToken);
    const firebaseUser = await admin.auth().getUser(decoded.uid);

    console.log("FIREBASE USER:", firebaseUser);

    const name = firebaseUser.displayName || "Unnamed";
    const email = firebaseUser.email;
    const picture = firebaseUser.photoURL || "";

    if (!email) {
      return res.status(400).json({ error: "Firebase email missing" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        photoURL: picture,
        role: "member"
      });
    }

    const token = jwt.sign(
      { email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" ,maxAge: 7*24*60*60*1000 })
       .json({ message: "Login success", user });

  } catch (err) {
    console.log("ERROR:", err);
    res.status(400).json({ error: err.message });
  }
};
export const getMe = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.json({ user: null });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    res.json({ user });
  } catch {
    res.json({ user: null });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
};
export const updateUser = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const updated = await User.findOneAndUpdate(
      { email: decoded.email },
      {
        name: req.body.name,
        photoURL: req.body.photoURL
      },
      { new: true }
    );

    res.json({ user: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};