import express from "express";
import morgan from "morgan";
import cors from "cors";

import authRoutes from "./Routes/authRoutes.js";
import adminRoutes from "./Routes/adminRoutes.js";
import managerRoutes from "./Routes/managerRoutes.js";
import memberRoutes from "./Routes/memberRoutes.js";
import clubRoutes from "./Routes/clubRoutes.js";
import eventRoutes from "./Routes/eventRoutes.js";
import paymentRoutes from "./Routes/paymentRoutes.js";
import eventRegistrationRoutes from "./Routes/eventRegistrationRoutes.js";
import membershipRoutes from "./Routes/membershipRoutes.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

// ---------- CORS SETUP ----------
app.use(
  cors({
    origin: "https://admirable-sfogliatella-88913a.netlify.app", // frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ---------- ROUTES ----------
app.use("/api/auth", authRoutes);
app.use("/api/dashboard/admin", adminRoutes);
app.use("/api/dashboard/manager", managerRoutes);
app.use("/api/dashboard/member", memberRoutes);

app.use("/api/clubs", clubRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/event-registrations", eventRegistrationRoutes);
app.use("/api/memberships", membershipRoutes);

app.get("/", (req, res) => {
  res.send("API Running...");
});

// ---------- ERROR HANDLER ----------
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

export default app;
