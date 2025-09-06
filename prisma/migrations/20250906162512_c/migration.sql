/*
  Warnings:

  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."PaidVia" AS ENUM ('PAYME', 'CLICK', 'CASH');

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "role",
ADD COLUMN     "role" "public"."UserType" NOT NULL DEFAULT 'BUY';

-- CreateTable
CREATE TABLE "public"."purchasedcourses" (
    "id" TEXT NOT NULL,
    "houseId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DECIMAL(65,30),
    "paidVia" "public"."PaidVia" NOT NULL,
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "purchasedcourses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."purchasedcourses" ADD CONSTRAINT "purchasedcourses_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "public"."houses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."purchasedcourses" ADD CONSTRAINT "purchasedcourses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
