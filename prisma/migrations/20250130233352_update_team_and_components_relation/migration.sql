-- DropForeignKey
ALTER TABLE "Component" DROP CONSTRAINT "Component_id_team_fkey";

-- AlterTable
ALTER TABLE "Component" ALTER COLUMN "id_team" SET DEFAULT 1;

-- AddForeignKey
ALTER TABLE "Component" ADD CONSTRAINT "Component_id_team_fkey" FOREIGN KEY ("id_team") REFERENCES "Team"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;
