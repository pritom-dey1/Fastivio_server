import User from "../models/User.js"

export const onboardUser = async (req,res)=>{
  const {name, about, interests} = req.body
  const email = req.user.email
  const user = await User.findOneAndUpdate({email},{name,about,interests,onboarded:true},{new:true,upsert:true})
  res.json({success:true,user})
}

export const getProfile = async (req,res)=>{
  const email = req.user.email
  const user = await User.findOne({email})
  res.json({user})
}
