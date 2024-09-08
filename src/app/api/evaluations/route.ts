import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import type { EvaluationSheet } from "@prisma/client";
const prisma = new PrismaClient();

export const POST = async (request: Request) => {
  const body: EvaluationSheet = await request.json();
  const evaluationSheet= await prisma.evaluationSheet.create({
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
