/*
  Warnings:

  - Added the required column `token` to the `TeamLogins` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TeamLogins" ADD COLUMN     "token" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "PowerUp" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "belongsToId" TEXT NOT NULL,
    "usedOnId" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "usedAt" TIMESTAMP(3),
    "roundTeamId" TEXT,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "PowerUp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clearanceLevel" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PowerUp" ADD CONSTRAINT "PowerUp_roundTeamId_fkey" FOREIGN KEY ("roundTeamId") REFERENCES "Round"("teamId") ON DELETE SET NULL ON UPDATE CASCADE;
