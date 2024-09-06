-- CreateEnum
CREATE TYPE "StatusEvaluation" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "EvaluationSheet" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "date_start" TIMESTAMP(3) NOT NULL,
    "date_finish" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "status" "StatusEvaluation" NOT NULL DEFAULT 'PENDING',
    "year" TEXT NOT NULL,

    CONSTRAINT "EvaluationSheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Component" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "weight" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Component_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubComponent" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "weight" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SubComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Criteria" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Criteria_pkey" PRIMARY KEY ("id")
);
