const pricingTiers = [
  {
    title: "LemonSqueezy Payment",
    price: "$9",
    features: [
      "Get access to all the leads",
      "Ability to download Leads",
      "View Rich data",
      "Contribute to the data",
    ],
    paymentProvider: "LemonSqueezy",
    lemonSqueezy: {
      buyLink:
        "https://xpage.lemonsqueezy.com/checkout/buy/aa74bc53-57d0-4837-9d5d-c1791db958d6?embed=1",
    },
    stripe: {},
  },
  {
    title: "Stripe Payment",
    price: "$19",
    features: [
      "Get access to all the leads",
      "Ability to download Leads",
      "View Rich data",
      "Contribute to the data",
    ],
    paymentProvider: "Stripe",
    lemonSqueezy: {},
    stripe: {
      lineItems: [
        // {
        //   price: "price_1OUacyGNooMUlLQ02zOmeYdX",
        //   quantity: 1,
        // },
        {
          price: "price_1OpuSiGNooMUlLQ0D8h0arUX",
          quantity: 1,
        },
      ],
      checkoutType: "subscription", // one_time OR subscription
    },
  },
];

export default pricingTiers;
