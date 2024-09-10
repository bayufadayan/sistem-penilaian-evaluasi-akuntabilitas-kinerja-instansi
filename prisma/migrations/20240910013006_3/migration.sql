-- DropForeignKey
ALTER TABLE "Component" DROP CONSTRAINT "Component_id_team_fkey";

-- AddForeignKey
ALTER TABLE "Component" ADD CONSTRAINT "Component_id_team_fkey" FOREIGN KEY ("id_team") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
