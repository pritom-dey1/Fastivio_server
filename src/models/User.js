import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    photoURL: { type: String },
    role: { type: String, enum: ["admin", "clubManager", "member"], default: "member" }
  },
  { timestamps: true }
)

export default mongoose.model("User", userSchema)
