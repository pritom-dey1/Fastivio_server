// routes/paymentRoutes.js
import express from "express";
import Stripe from "stripe";
import { createPayment, getAllPayments, getMyPayments } from "../controllers/paymentController.js";
import { verifyJWT, verifyRole } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(verifyJWT);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 1️⃣ Create a new payment record directly (existing route)
router.post("/", verifyRole("member"), createPayment);

// 2️⃣ Get all payments (Admin / Manager)
router.get("/", verifyJWT, getAllPayments);

// 3️⃣ Get logged-in user's payments
router.get("/my", verifyRole("member"), getMyPayments);

// 4️⃣ Create Stripe Checkout session for club membership
router.post("/stripe-session", verifyRole("member"), async (req, res) => {
  try {
    const { amount, clubId } = req.body;

    if (!amount || !clubId) {
      return res.status(400).json({ error: "Amount and clubId are required" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: `Club Membership Fee - ${clubId}` },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/payment-success?clubId=${clubId}`,
      cancel_url: `${process.env.CLIENT_URL}/club/${clubId}`,
      metadata: {
        clubId,
        userId: req.user.id,
        userEmail: req.user.email,
      },
    });

    res.status(200).json({ id: session.id });
  } catch (err) {
    console.error("Stripe session error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 5️⃣ Webhook to confirm Stripe payment (optional but recommended)
router.post("/webhook", express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature mismatch:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Create payment record
    await createPayment({
      body: {
        amount: session.amount_total / 100,
        type: "membership",
        clubId: session.metadata.clubId,
        stripePaymentIntentId: session.payment_intent,
        status: "success",
      },
      user: {
        id: session.metadata.userId,
        email: session.metadata.userEmail,
      },
    }, { status: () => ({ json: () => {} }) }); // dummy response object

    // TODO: Create membership here if you want
    console.log("Payment successful for user:", session.metadata.userEmail);
  }

  res.json({ received: true });
});

// PaymentIntent তৈরি করে clientSecret পাঠাবে
router.post("/create-payment-intent", verifyRole("member"), async (req, res) => {
  try {
    const { amount, clubId } = req.body;
    if (!amount || !clubId) return res.status(400).json({ error: "Amount and clubId are required" });

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      metadata: { clubId, userId: req.user.id, userEmail: req.user.email },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;