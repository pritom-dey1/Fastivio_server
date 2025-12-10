import axios from "axios"
import User from "../models/User.js"
import Conversation from "../models/Conversation.js"

export const handleChat = async (req,res)=>{
  const {message, conversationId} = req.body
  const email = req.user.email
  const user = await User.findOne({email})
  let conversation
  if(conversationId) conversation = await Conversation.findById(conversationId)
  else conversation = await Conversation.create({userId:user._id,messages:[]})
  const systemPrompt = `
You are ClubSphere assistant. Answer using ONLY the context below. Personalize using:
Name: ${user.name}
About: ${user.about || "N/A"}
Interests: ${user.interests.join(", ") || "N/A"}
`
  const contextChunks = [] 
  const prompt = systemPrompt + "\nContext:\n" + contextChunks.map(c=>c.text).join("\n") + `\nUser: ${message}\nAssistant:`
  const response = await axios.post("https://api-inference.huggingface.co/models/google/gemma-2-9b",{inputs:prompt},{headers:{"Authorization":`Bearer ${process.env.HF_API_KEY}`}})
  const answer = response.data?.[0]?.generated_text || "Sorry, I cannot answer that."
  conversation.messages.push({role:"user",text:message})
  conversation.messages.push({role:"assistant",text:answer})
  await conversation.save()
  res.json({conversationId:conversation._id,message:answer})
}
