/*
  Warnings:

  - Made the column `roundId` on table `PowerUp` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "PowerUp" DROP CONSTRAINT "PowerUp_roundId_fkey";

-- AlterTable
ALTER TABLE "PowerUp" ALTER COLUMN "roundId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "PowerUp" ADD CONSTRAINT "PowerUp_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "Round"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
