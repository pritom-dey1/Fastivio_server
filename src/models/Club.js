import mongoose from "mongoose"

const clubSchema = new mongoose.Schema(
  {
    clubName: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["Photography", "Sports", "Tech", "Music", "Art", "Other"]
    },
    location: { type: String, required: true, trim: true },
    bannerImage: { type: String, default: "" },
    membershipFee: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
)

clubSchema.index({ managerId: 1 })
clubSchema.index({ status: 1 })

export default mongoose.model("Club", clubSchema)
