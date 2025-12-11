import EventRegistration from "../models/EventRegistration.js";

// Member: register for event
export const registerForEvent = async (req, res) => {
  try {
    const { eventId, clubId, paymentId } = req.body;

    const existing = await EventRegistration.findOne({
      eventId,
      userId: req.user._id,
      status: "registered" 
    });

    if (existing) {
      return res.status(400).json({ error: "You have already registered for this event." });
    }

    const registration = await EventRegistration.create({
      eventId,
      userId: req.user._id,       
      userEmail: req.user.email,
      clubId,
      paymentId,
      status: "registered",
    });

    res.status(201).json(registration);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Member: cancel registration
export const cancelRegistration = async (req, res) => {
  try {
    const registration = await EventRegistration.findById(req.params.id);
    if (!registration) return res.status(404).json({ error: "Registration not found" });

    if (registration.userEmail !== req.user.email) return res.status(403).json({ error: "Forbidden" });

    registration.status = "cancelled";
    await registration.save();

    res.json(registration);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ClubManager: see registrations for their event
export const getEventRegistrations = async (req, res) => {
   console.log("Cancel endpoint hit with:", req.params.id);
  try {
    const registrations = await EventRegistration.find({ eventId: req.params.eventId });
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Member: get own registrations
export const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await EventRegistration.find({ userEmail: req.user.email });
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
