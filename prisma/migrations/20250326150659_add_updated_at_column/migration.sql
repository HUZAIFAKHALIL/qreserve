/*
  Warnings:

  - You are about to drop the column `threshold` on the `LoyaltyDiscount` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `LoyaltyDiscount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LoyaltyDiscount" DROP COLUMN "threshold",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "maxDiscount" DOUBLE PRECISION NOT NULL DEFAULT 25,
ADD COLUMN     "nextTierSpent" DOUBLE PRECISION NOT NULL DEFAULT 100,
ADD COLUMN     "totalSpent" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "discount" SET DEFAULT 0,
ALTER COLUMN "discountType" SET DEFAULT 'PERCENTAGE';
