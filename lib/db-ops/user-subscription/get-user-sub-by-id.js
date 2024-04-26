import prisma from "@/lib/prismaClient";

export const getUserSubByUserId = async (userId) => {
  const userSubscription = await prisma.userSubscription.findFirst({
    where: {
      userId: userId,
    },
  });
  return userSubscription;
};
