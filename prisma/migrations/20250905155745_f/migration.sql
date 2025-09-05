-- CreateEnum
CREATE TYPE "public"."UserType" AS ENUM ('BUY', 'SELL', 'ADMIN');

-- AlterTable
ALTER TABLE "public"."Users" ALTER COLUMN "role" SET DEFAULT 'BUY';
