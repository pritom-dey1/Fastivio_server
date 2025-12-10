import mongoose from "mongoose";

const eventRegistrationSchema = new mongoose.Schema(
  {
    eventId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Event", 
      required: true 
    },

    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },

    userEmail: { 
      type: String, 
      required: true 
    },

    clubId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Club", 
      required: true 
    },

    status: { 
      type: String, 
      enum: ["registered", "cancelled"], 
      default: "registered" 
    },

    paymentId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Payment",
      default: null
    },

    registeredAt: { 
      type: Date, 
      default: Date.now 
    },
  },
  { timestamps: true }
);

const EventRegistration = mongoose.model("EventRegistration", eventRegistrationSchema);
export default EventRegistration;
