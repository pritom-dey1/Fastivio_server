import Event from "../models/Event.js";

// Get all events (Admin only)
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("clubId", "clubName");
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get events of logged-in clubManager's clubs
export const getManagerEvents = async (req, res) => {
  try {
    const events = await Event.find({ clubId: { $in: req.user.managedClubs || [] } });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get events for a member
export const getMemberEvents = async (req, res) => {
  try {
    const events = await Event.find({}).populate("clubId", "clubName");
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new event (ClubManager only)
export const createEvent = async (req, res) => {
  try {
    const { clubId, title, description, eventDate, location, isPaid, eventFee, maxAttendees } = req.body;

    const event = await Event.create({
      clubId,
      title,
      description,
      eventDate,
      location,
      isPaid,
      eventFee,
      maxAttendees,
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update event (ClubManager only)
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    Object.assign(event, req.body); 
    await event.save();

    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete event (ClubManager only)
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getEventsByClub = async (req, res) => {
  try {
    const events = await Event.find({ clubId: req.params.clubId });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};