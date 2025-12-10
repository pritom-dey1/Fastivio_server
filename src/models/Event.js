import mongoose from "mongoose"

const eventSchema = new mongoose.Schema(
  {
    clubId: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true },
    title: { type: String, required: true },
    description: { type: String },
    eventDate: { type: Date, required: true },
    location: { type: String },
    isPaid: { type: Boolean, default: false },
    eventFee: { type: Number, default: 0 },
    maxAttendees: { type: Number }
  },
  { timestamps: true }
)

eventSchema.index({ clubId: 1 })
eventSchema.index({ eventDate: 1 })

export default mongoose.model("Event", eventSchema)
