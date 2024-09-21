-- CreateTable
CREATE TABLE "SubComponentScore" (
    "id" SERIAL NOT NULL,
    "nilaiAvgOlah" DOUBLE PRECISION NOT NULL,
    "nilai" DOUBLE PRECISION NOT NULL,
    "persentase" DOUBLE PRECISION NOT NULL,
    "grade" TEXT NOT NULL,
    "id_subcomponents" INTEGER NOT NULL,

    CONSTRAINT "SubComponentScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComponentScore" (
    "id" SERIAL NOT NULL,
    "nilai" DOUBLE PRECISION NOT NULL,
    "id_components" INTEGER NOT NULL,

    CONSTRAINT "ComponentScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvaluationSheetScore" (
    "id" SERIAL NOT NULL,
    "nilai" DOUBLE PRECISION NOT NULL,
    "grade" TEXT NOT NULL,
    "id_LKE" TEXT NOT NULL,

    CONSTRAINT "EvaluationSheetScore_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SubComponentScore" ADD CONSTRAINT "SubComponentScore_id_subcomponents_fkey" FOREIGN KEY ("id_subcomponents") REFERENCES "SubComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComponentScore" ADD CONSTRAINT "ComponentScore_id_components_fkey" FOREIGN KEY ("id_components") REFERENCES "Component"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationSheetScore" ADD CONSTRAINT "EvaluationSheetScore_id_LKE_fkey" FOREIGN KEY ("id_LKE") REFERENCES "EvaluationSheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
