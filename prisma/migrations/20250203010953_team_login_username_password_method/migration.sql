/*
  Warnings:

  - You are about to drop the column `credential` on the `TeamLogins` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[password]` on the table `TeamLogins` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password` to the `TeamLogins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `TeamLogins` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "TeamLogins_credential_key";

-- AlterTable
ALTER TABLE "TeamLogins" DROP COLUMN "credential",
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TeamLogins_password_key" ON "TeamLogins"("password");
