import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import type { EvaluationSheet } from "@prisma/client";
const prisma = new PrismaClient();

export const POST = async (request: Request) => {
  const body: EvaluationSheet = await request.json();
  const evaluationSheet = await prisma.evaluationSheet.create({
    data: {
      title: body.title,
      date_start: body.date_start,
      date_finish: body.date_finish,
      description: body.description,
      status: body.status,
      year: body.year,
    },
  });

  const evaluationSheetScore = await prisma.evaluationSheetScore.create({
    data: {
        nilai: null,
        grade: null,
        id_LKE: evaluationSheet.id,
    },
});

  return NextResponse.json({evaluationSheet, evaluationSheetScore}, { status: 201 });
};

export const GET = async () => {
  try {
    const sheets = await prisma.evaluationSheet.findMany();
    return NextResponse.json(sheets);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch evaluation sheets" },
      { status: 500 }
    );
  }
};
