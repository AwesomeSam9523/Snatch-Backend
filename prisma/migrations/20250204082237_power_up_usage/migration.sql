/*
  Warnings:

  - You are about to drop the column `belongsToId` on the `PowerUp` table. All the data in the column will be lost.
  - You are about to drop the column `roundTeamId` on the `PowerUp` table. All the data in the column will be lost.
  - You are about to drop the column `usedAt` on the `PowerUp` table. All the data in the column will be lost.
  - You are about to drop the column `usedOnId` on the `PowerUp` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PowerUp" DROP CONSTRAINT "PowerUp_roundTeamId_fkey";

-- AlterTable
ALTER TABLE "PowerUp" DROP COLUMN "belongsToId",
DROP COLUMN "roundTeamId",
DROP COLUMN "usedAt",
DROP COLUMN "usedOnId",
ADD COLUMN     "roundId" TEXT,
ADD COLUMN     "teamId" TEXT;

-- CreateTable
CREATE TABLE "PowerupUsage" (
    "id" TEXT NOT NULL,
    "powerupId" TEXT NOT NULL,
    "usedOnTeamId" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    "usedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PowerupUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PowerupUsage_powerupId_key" ON "PowerupUsage"("powerupId");

-- AddForeignKey
ALTER TABLE "PowerUp" ADD CONSTRAINT "PowerUp_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PowerUp" ADD CONSTRAINT "PowerUp_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "Round"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PowerupUsage" ADD CONSTRAINT "PowerupUsage_powerupId_fkey" FOREIGN KEY ("powerupId") REFERENCES "PowerUp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PowerupUsage" ADD CONSTRAINT "PowerupUsage_usedOnTeamId_fkey" FOREIGN KEY ("usedOnTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PowerupUsage" ADD CONSTRAINT "PowerupUsage_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "Round"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
