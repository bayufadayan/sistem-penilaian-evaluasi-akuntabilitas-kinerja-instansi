import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

enum StatusEvaluation {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

type EvaluationCountsResult = {
  [key in StatusEvaluation]?: number;
};

export const GET = async () => {
  try {
    const evaluationCounts = await prisma.evaluationSheet.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    });

    const result: EvaluationCountsResult = {};

    evaluationCounts.forEach((item) => {
      result[item.status as StatusEvaluation] = item._count.status;
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching evaluations by status:", error);
    return NextResponse.json(
      { error: "Failed to fetch evaluation counts by status" },
      { status: 500 }
    );
  }
};
