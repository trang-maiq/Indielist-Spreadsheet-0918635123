export const config = {
  api: {
    bodyParser: false,
  },
};

import { getUserSubBySubcriptionId } from "@/lib/db-ops/user-subscription/get-user-sub-by-sub-id";
import { updateUserSubscriptionRecord } from "@/lib/db-ops/user-subscription/update-user-sub";
import { getUserByUserEmail } from "@/lib/db-ops/user/get-user-by-email";
import getRawBody from "raw-body";
const stripe = require("stripe")(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

const webhookSecret = process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET;

// Use default export to define the API route
export default async function handler(req, res) {
  try {
    const buf = await getRawBody(req);

    const sig = req.headers["stripe-signature"];
    console.log(sig);

    let event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
      console.log(err);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userEmail = session.customer_details.email;
      const subscriptionId = session?.subscription;

      console.log(
        "Checkout session completed",
        session.id,
        userEmail,
        subscriptionId
      );

      if (!userEmail) {
        throw new Error(`missing user email, ${event.id}`);
      }

      const userByEmail = await getUserByUserEmail(userEmail);
      if (!userByEmail) {
        console.log("User not found");
        return;
      }

      // Distinguish between one-time payment and subscription
      if (subscriptionId) {
        console.log("Subscription payment");
        // Assuming updateUserSubscriptionRecord method can handle both subscription and one-time payment updates
        await updateUserSubscriptionRecord({
          id: userByEmail.id,
          userId: userByEmail.id,
          isSubscribed: true,
          subscribedOn: new Date(),
          subscriptionId: subscriptionId,
        });
      } else if (session.payment_status === "paid") {
        console.log("One-time payment");
        await updateUserSubscriptionRecord({
          id: userByEmail.id,
          userId: userByEmail.id,
          isSubscribed: true,
          subscribedOn: new Date(),
        });
      }
    } else if (event.type === "customer.subscription.created") {
      console.log("Subscription created. already handled in checkout event");
    } else if (event.type === "customer.subscription.deleted") {
      const subscriptionId = event.data.object.id;

      console.log("Subscription deleted", subscriptionId);

      const userSubscription = await getUserSubBySubcriptionId(subscriptionId);
      if (userSubscription) {
        await updateUserSubscriptionRecord({
          id: userSubscription.id,
          userId: userSubscription.userId,
          isSubscribed: false,
        });
      }
    }
    return res.status(200).json({ result: event, ok: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "something went wrong",
      ok: false,
    });
  }
}
