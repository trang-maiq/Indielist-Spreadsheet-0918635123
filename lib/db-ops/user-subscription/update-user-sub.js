import prisma from "@/lib/prismaClient";

export const updateUserSubscriptionRecord = async (data) => {
  const upsertedTable = await prisma.userSubscription.upsert({
    where: { id: data.id },
    update: data,
    create: data,
  });
  return upsertedTable;
};
