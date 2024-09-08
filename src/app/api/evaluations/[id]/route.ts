import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import type { EvaluationSheet } from "@prisma/client";
const prisma = new PrismaClient();

export const GET = async (
  req: NextRequest,
  context: { params: { id: string } }
) => {
  const id = Number(context.params.id) || 0;
  const evaluationSheet = await prisma.evaluationSheet.findFirst({
    where: {
      id: id,
    },
  });
  if (!evaluationSheet) {
    return NextResponse.json({ message: "evaluationSheet not found" }, { status: 404 });
  }

  return NextResponse.json(evaluationSheet);
};

export const DELETE = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const evaluationSheet = await prisma.evaluationSheet.delete({
    where: {
      id: Number(params.id),
    },
  });

  return NextResponse.json(evaluationSheet, { status: 200 });
};

export const PATCH = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const body: EvaluationSheet = await request.json();
  const evaluationSheet = await prisma.evaluationSheet.update({
    where: {
      id: Number(params.id),
    },
    data: {
      title: body.title,
      date_start: body.date_start,
      date_finish: body.date_finish,
      description: body.description,
      status: body.status,
      year: body.year,
    },
  });

  return NextResponse.json(evaluationSheet, { status: 201 });
};
