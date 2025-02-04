/*
  Warnings:

  - The primary key for the `Round` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `Round` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "PowerUp" DROP CONSTRAINT "PowerUp_roundTeamId_fkey";

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_id_fkey";

-- AlterTable
ALTER TABLE "Round" DROP CONSTRAINT "Round_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Round_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Round" ADD CONSTRAINT "Round_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PowerUp" ADD CONSTRAINT "PowerUp_roundTeamId_fkey" FOREIGN KEY ("roundTeamId") REFERENCES "Round"("id") ON DELETE SET NULL ON UPDATE CASCADE;
