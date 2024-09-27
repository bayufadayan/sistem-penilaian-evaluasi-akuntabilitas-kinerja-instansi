// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import type { EvaluationSheet } from "@prisma/client";
const prisma = new PrismaClient();

export const GET = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const id = params.id;

  try {
    const evaluationSheet = await prisma.evaluationSheet.findUnique({
      where: { id },
      include: {
        components: {
          where: { id_LKE: id },
          include: {
            componentScore: true,
            subComponents: {
              include: {
                subComponentScore: true,
                criteria: true,
              },
            },
          },
        },
      },
    });

    if (!evaluationSheet) {
      return NextResponse.json(
        { message: "EvaluationSheet not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(evaluationSheet);
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const evaluationSheet = await prisma.evaluationSheet.delete({
    where: {
      id: params.id,
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
      id: params.id,
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
