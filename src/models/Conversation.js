import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
  role: String,
  text: String,
  timestamp: { type: Date, default: Date.now }
})

const conversationSchema = new mongoose.Schema({
  userId: String,
  messages: [messageSchema],
  usedChunks: [{ source: String, url: String, score: Number }],
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model("Conversation", conversationSchema)
