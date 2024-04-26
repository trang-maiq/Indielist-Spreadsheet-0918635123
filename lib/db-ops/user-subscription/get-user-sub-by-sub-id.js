import prisma from "@/lib/prismaClient";

export const getUserSubBySubcriptionId = async (subscriptionId) => {
  const userSubscription = await prisma.userSubscription.findFirst({
    where: {
      subscriptionId: subscriptionId,
    },
  });
  return userSubscription;
};
