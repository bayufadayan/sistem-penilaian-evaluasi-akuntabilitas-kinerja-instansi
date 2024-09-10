/*
  Warnings:

  - The primary key for the `EvaluationSheet` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Component" DROP CONSTRAINT "Component_id_LKE_fkey";

-- DropForeignKey
ALTER TABLE "Component" DROP CONSTRAINT "Component_id_team_fkey";

-- AlterTable
ALTER TABLE "Component" ALTER COLUMN "id_LKE" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "EvaluationSheet" DROP CONSTRAINT "EvaluationSheet_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "EvaluationSheet_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "EvaluationSheet_id_seq";

-- AddForeignKey
ALTER TABLE "Component" ADD CONSTRAINT "Component_id_team_fkey" FOREIGN KEY ("id_team") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Component" ADD CONSTRAINT "Component_id_LKE_fkey" FOREIGN KEY ("id_LKE") REFERENCES "EvaluationSheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
