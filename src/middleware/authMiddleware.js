// src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Verify JWT from httpOnly cookie
export const verifyJWT = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Unauthorized: No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userFromDB = await User.findOne({ email: decoded.email });
    if (!userFromDB) return res.status(401).json({ error: "Unauthorized: User not found" });

    req.user = userFromDB; 
    next();
  } catch (err) {
    console.error("JWT verification error:", err.message);
    return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }
};

// Role-based access middleware
// Accept single role or array of roles
export const verifyRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized: No user attached" });

    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
    }

    next();
  };
};
