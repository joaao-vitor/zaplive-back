/*
  Warnings:

  - You are about to drop the column `accessToken` on the `Token` table. All the data in the column will be lost.
  - Added the required column `ip` to the `Token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isValid` to the `Token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userAgent` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Token" DROP COLUMN "accessToken",
ADD COLUMN     "ip" TEXT NOT NULL,
ADD COLUMN     "isValid" BOOLEAN NOT NULL,
ADD COLUMN     "userAgent" TEXT NOT NULL;
