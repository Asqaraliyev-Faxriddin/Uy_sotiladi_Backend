/*
  Warnings:

  - You are about to drop the `purchasedcourses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."purchasedcourses" DROP CONSTRAINT "purchasedcourses_houseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."purchasedcourses" DROP CONSTRAINT "purchasedcourses_userId_fkey";

-- DropTable
DROP TABLE "public"."purchasedcourses";

-- CreateTable
CREATE TABLE "public"."house_payments" (
    "id" TEXT NOT NULL,
    "houseId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "paidVia" "public"."PaidVia" NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "house_payments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."house_payments" ADD CONSTRAINT "house_payments_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "public"."houses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."house_payments" ADD CONSTRAINT "house_payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
