/*
  Warnings:

  - You are about to drop the column `planName` on the `UserSubscription` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionId` on the `UserSubscription` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionStatus` on the `UserSubscription` table. All the data in the column will be lost.
  - Added the required column `isSubscribed` to the `UserSubscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserSubscription" DROP COLUMN "planName",
DROP COLUMN "subscriptionId",
DROP COLUMN "subscriptionStatus",
ADD COLUMN     "isSubscribed" BOOLEAN NOT NULL,
ADD COLUMN     "subscribedOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
