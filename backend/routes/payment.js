const express = require("express");
const Stripe = require("stripe");
const router = express.Router();

const stripe = Stripe("sk_test_YOUR_SECRET_KEY"); // Replace with your actual Secret Key

router.post("/create-checkout-session", async (req, res) => {
  const { products } = req.body;

  const line_items = products.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.name,
      },
      unit_amount: item.price * 100,
    },
    quantity: item.quantity,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: "http://localhost:3001/success",
      cancel_url: "http://localhost:3001/cancel",
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
