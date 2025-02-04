/*
  Warnings:

  - Made the column `teamId` on table `PowerUp` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "PowerUp" DROP CONSTRAINT "PowerUp_teamId_fkey";

-- AlterTable
ALTER TABLE "PowerUp" ALTER COLUMN "teamId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "PowerUp" ADD CONSTRAINT "PowerUp_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
