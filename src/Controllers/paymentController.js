import Payment from "../models/Payment.js";

// Create payment record (after Stripe success or membership join)
export const createPayment = async (req, res) => {
  try {
 

    const { amount, type, clubId, eventId, stripePaymentIntentId, status } = req.body;

const payment = await Payment.create({
  userId: req.user._id,            
  userEmail: req.user.email,
  amount,
  type,
  clubId,
  eventId,
  stripePaymentIntentId,
  status: status || "pending",
});

    console.log("PAYMENT CREATED:", payment);

    res.status(201).json(payment);
  } catch (err) {
    console.error("CREATE PAYMENT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


// Get all payments (Admin / Manager)
export const getAllPayments = async (req, res) => {
  try {
    let payments;

    if (req.user.role === "admin") {
      payments = await Payment.find();
    } else if (req.user.role === "clubManager") {
      
      payments = await Payment.find({ clubId: { $in: req.user.managedClubs || [] } });
    } else {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get payments for the logged-in member
export const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userEmail: req.user.email });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
