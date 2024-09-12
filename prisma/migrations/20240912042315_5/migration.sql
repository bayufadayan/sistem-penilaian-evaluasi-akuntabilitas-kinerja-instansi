-- AlterTable
ALTER TABLE "Component" ADD COLUMN     "component_number" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Criteria" ADD COLUMN     "criteria_number" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Score" ALTER COLUMN "id_users" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SubComponent" ADD COLUMN     "subcomponent_number" INTEGER NOT NULL DEFAULT 0;
