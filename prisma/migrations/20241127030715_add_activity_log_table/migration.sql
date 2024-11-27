-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_id_users_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_id_team_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "id_team" SET DEFAULT 1;

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" SERIAL NOT NULL,
    "actionType" TEXT NOT NULL,
    "tableName" TEXT NOT NULL,
    "recordId" INTEGER NOT NULL,
    "id_users" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_id_team_fkey" FOREIGN KEY ("id_team") REFERENCES "Team"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_id_users_fkey" FOREIGN KEY ("id_users") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_id_users_fkey" FOREIGN KEY ("id_users") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
