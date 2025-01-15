import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import type { EvaluationSheet } from "@prisma/client";
import { createActivityLog } from "@/lib/activityLog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
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

  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json(
      { message: "User not authenticated" },
      { status: 401 }
    );
  }
  const activityLog = createActivityLog(
    "LKE AKIP baru dibuat",
    "User",
    0,
    Number(session.user.id)
  );
  return NextResponse.json(
    { evaluationSheet, evaluationSheetScore, activityLog },
    { status: 201 }
  );
};

export const GET = async () => {
  try {
    const sheets = await prisma.evaluationSheet.findMany({
      include: {
        evaluationSheetScore: true,
      },
    });
    return NextResponse.json(sheets);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch evaluation sheets" },
      { status: 500 }
    );
  }
};
