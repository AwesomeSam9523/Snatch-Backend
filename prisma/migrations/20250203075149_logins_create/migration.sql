-- DropForeignKey
ALTER TABLE "TeamLogins" DROP CONSTRAINT "TeamLogins_teamId_fkey";

-- AlterTable
ALTER TABLE "Round" ALTER COLUMN "roundNo" SET DEFAULT 1,
ALTER COLUMN "score" SET DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_id_fkey" FOREIGN KEY ("id") REFERENCES "TeamLogins"("teamId") ON DELETE RESTRICT ON UPDATE CASCADE;
