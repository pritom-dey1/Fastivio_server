import mongoose from "mongoose";

const eventRegistrationSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    userEmail: { type: String, required: true },
    clubId: { type: mongoose.Schema.Types.ObjectId, ref: "Club" },
    status: { type: String, enum: ["registered", "cancelled"], default: "registered" },
    paymentId: String,
    registeredAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const EventRegistration = mongoose.model("EventRegistration", eventRegistrationSchema);
export default EventRegistration;
