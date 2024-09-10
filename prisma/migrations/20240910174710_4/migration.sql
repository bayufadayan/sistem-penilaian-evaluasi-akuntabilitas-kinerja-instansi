-- CreateEnum
CREATE TYPE "ScoreExplainSection" AS ENUM ('Keberadaan', 'Kualitas', 'Pemanfaat');

-- CreateTable
CREATE TABLE "ExplainingScore" (
    "id" SERIAL NOT NULL,
    "section" "ScoreExplainSection" NOT NULL,
    "pilihan" TEXT NOT NULL,
    "nilai" TEXT NOT NULL,
    "penjelasan" TEXT NOT NULL,

    CONSTRAINT "ExplainingScore_pkey" PRIMARY KEY ("id")
);
