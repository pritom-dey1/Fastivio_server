import mongoose from "mongoose"

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["membership", "event"], required: true },
    clubId: { type: mongoose.Schema.Types.ObjectId, ref: "Club" },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    stripePaymentIntentId: { type: String, index: true },
    status: { type: String, enum: ["pending", "success", "failed"], default: "pending" }
  },
  { timestamps: true }
)

paymentSchema.index({ userId: 1 })
paymentSchema.index({ clubId: 1 })
paymentSchema.index({ eventId: 1 })

export default mongoose.model("Payment", paymentSchema)
