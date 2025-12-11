// src/middleware/firebaseAuth.js
import admin from "../config/firebase.js";


export const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = await admin.auth().verifyIdToken(token);

    // attach decoded firebase user to request for downstream controllers
    req.firebaseUser = decoded; // contains email, uid, etc.
    return next();
  } catch (err) {
    console.error("Firebase token verification failed:", err.message || err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
