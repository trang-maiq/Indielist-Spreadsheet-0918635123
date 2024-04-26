export const config = {
  api: {
    bodyParser: false,
  },
};

export const maxDuration = 300;

import { updateUserSubscriptionRecord } from "@/lib/db-ops/user-subscription/update-user-sub";
import { getUserByUserEmail } from "@/lib/db-ops/user/get-user-by-email";
import getRawBody from "raw-body";

const relevantEvents = new Set([
  "order_created",
  "subscription_created",
  "subscription_updated",
  "subscription_cancelled",
  "subscription_resumed",
  "subscription_expired",
  "subscription_paused",
  "subscription_unpaused",
]);

export default async function handler(req, res) {
  const crypto = require("crypto");

  const rawBody = await getRawBody(req);

  const secret = process.env.LEMONS_SQUEEZY_SIGNATURE_SECRET;
  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(rawBody).digest("hex"); // Get the digest as a hex string

  const signature = req.headers["x-signature"];

  if (digest !== signature) {
    throw new Error("Invalid signature.");
  }

  const data = JSON.parse(rawBody);

  const eventType = data["meta"]["event_name"];
  console.log(eventType);

  if (relevantEvents.has(eventType)) {
    const susbcription = data["data"];

    const type = susbcription["type"];

    let purchaseStatus = null;
    let isSubscribed = false;

    if (type === "subscriptions" || type === "orders") {
      purchaseStatus = susbcription["attributes"]["status"];
    }

    if (purchaseStatus === "expired") {
      //purchase is not active anymore (will work on one time payment and subscription)
      isSubscribed = false;
    } else {
      isSubscribed = true;
    }

    const userEmail = susbcription["attributes"]["user_email"];

    const userByEmail = await getUserByUserEmail(userEmail);
    if (userByEmail) {
      const updatedTable = await updateUserSubscriptionRecord({
        id: userByEmail.id,
        userId: userByEmail.id,
        isSubscribed: isSubscribed,
        subscribedOn: new Date(),
      });
    }
  }

  return res.send({
    status: true,
    msg: "success",
  });
}
