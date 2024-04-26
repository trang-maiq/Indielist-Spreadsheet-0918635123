export async function stripeCheckout({ lineItems, userEmail, checkoutType }) {
  const stripe = require("stripe")(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

  let sessionConfig = {
    customer_email: userEmail,
    success_url: `${window.location.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: window.location.origin,
    allow_promotion_codes: true,
  };

  if (checkoutType === "one_time") {
    sessionConfig = {
      ...sessionConfig,
      mode: "payment",
      line_items: lineItems,
    };
  } else if (checkoutType === "subscription") {
    sessionConfig = {
      ...sessionConfig,
      mode: "subscription",
      line_items: lineItems.map((item) => ({
        ...item,
        quantity: item?.quantity || 1,
      })),
    };
  } else {
    throw new Error("Invalid checkout type specified.");
  }

  const session = await stripe.checkout.sessions.create(sessionConfig);

  return session.id;
}
