import stripe from "../config/strip.js";
import User from "../model/userModel.js";

export const stripWebhook = async (req, res) => {
  const strpe = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.log(error);
    return res.statuse(500).json({ message: "webhook error" });
  }

  if (event.type == "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata.userId;
    const credits = Number(session.metadata.credits);
    const plan = session.metadata.plan;

    await User.findByIdAndUpdate(userId, {
      $inc: { credits },
      plane,
    });
  }

  return res.json({ received: true });
};
