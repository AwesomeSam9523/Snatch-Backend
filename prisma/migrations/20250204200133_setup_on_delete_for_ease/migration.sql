-- DropForeignKey
ALTER TABLE "PowerUp" DROP CONSTRAINT "PowerUp_teamId_fkey";

-- DropForeignKey
ALTER TABLE "PowerupUsage" DROP CONSTRAINT "PowerupUsage_powerupId_fkey";

-- DropForeignKey
ALTER TABLE "Round" DROP CONSTRAINT "Round_teamId_fkey";

-- DropForeignKey
ALTER TABLE "TeamMember" DROP CONSTRAINT "TeamMember_teamId_fkey";

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Round" ADD CONSTRAINT "Round_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PowerUp" ADD CONSTRAINT "PowerUp_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PowerupUsage" ADD CONSTRAINT "PowerupUsage_powerupId_fkey" FOREIGN KEY ("powerupId") REFERENCES "PowerUp"("id") ON DELETE CASCADE ON UPDATE CASCADE;
