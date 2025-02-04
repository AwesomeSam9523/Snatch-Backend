-- AlterTable
ALTER TABLE "TeamMember" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdById" TEXT NOT NULL DEFAULT '444d2bbd-1e49-4329-be4a-6a1f4a3ddc25';

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
