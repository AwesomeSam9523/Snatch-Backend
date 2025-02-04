/*
  Warnings:

  - You are about to drop the column `userId` on the `TeamMember` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "TeamMember" DROP CONSTRAINT "TeamMember_userId_fkey";

-- AlterTable
ALTER TABLE "TeamMember" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "createdById" DROP NOT NULL,
ALTER COLUMN "createdById" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
