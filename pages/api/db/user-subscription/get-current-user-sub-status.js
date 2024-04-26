import { getUserSubByUserId } from "@/lib/db-ops/user-subscription/get-user-sub-by-id";
import { getToken } from "next-auth/jwt";
import { use } from "react";

export default async (req, res) => {
  if (req.method == "GET") {
    try {
      const token = await getToken({
        req: req,
        secret: process.env.NEXTAUTH_SECRET,
      });
      if (token) {
        const userId = token.user.id;
        console.log(token);
        const userSubscription = await getUserSubByUserId(userId);
        console.log("userSubscription", userSubscription);
        res.status(200).json(userSubscription);
      } else {
        res.status(401).json({ error: "you don't have permission" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }
};
