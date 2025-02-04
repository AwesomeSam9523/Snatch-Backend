-- CreateTable
CREATE TABLE "TeamLogins" (
    "teamId" TEXT NOT NULL,
    "credential" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamLogins_pkey" PRIMARY KEY ("teamId")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "eliminated" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Round" (
    "teamId" TEXT NOT NULL,
    "roundNo" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "Round_pkey" PRIMARY KEY ("teamId")
);

-- CreateIndex
CREATE UNIQUE INDEX "TeamLogins_credential_key" ON "TeamLogins"("credential");

-- AddForeignKey
ALTER TABLE "TeamLogins" ADD CONSTRAINT "TeamLogins_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_id_fkey" FOREIGN KEY ("id") REFERENCES "Round"("teamId") ON DELETE RESTRICT ON UPDATE CASCADE;
