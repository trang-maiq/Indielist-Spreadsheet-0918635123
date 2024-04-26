import prisma from "@/lib/prismaClient";

export const getUserByUserEmail = async (email) => {
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  return user;
};
