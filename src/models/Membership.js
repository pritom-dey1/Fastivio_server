import mongoose from "mongoose"

const membershipSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    clubId: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true },
    status: { type: String, enum: ["active", "expired", "pendingPayment"], default: "pendingPayment" },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
    joinedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date }
  },
  { timestamps: true }
)

membershipSchema.index({ userId: 1, clubId: 1 }, { unique: true })

export default mongoose.model("Membership", membershipSchema)
