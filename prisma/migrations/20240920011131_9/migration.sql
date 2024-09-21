-- AlterTable
ALTER TABLE "ComponentScore" ALTER COLUMN "nilai" DROP NOT NULL;

-- AlterTable
ALTER TABLE "EvaluationSheetScore" ALTER COLUMN "nilai" DROP NOT NULL,
ALTER COLUMN "grade" DROP NOT NULL;
