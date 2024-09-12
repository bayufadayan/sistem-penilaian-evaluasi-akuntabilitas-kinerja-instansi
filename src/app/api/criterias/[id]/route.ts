/* eslint-disable @typescript-eslint/no-unused-vars */
import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import type { Criteria } from "@prisma/client";
const prisma = new PrismaClient();

export const DELETE = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const criteria = await prisma.criteria.delete({
    where: {
      id: Number(params.id),
    },
  });

  return NextResponse.json(criteria, { status: 200 });
};

export const PATCH = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const body: Criteria = await request.json();
  const criteria = await prisma.criteria.update({
    where: {
      id: Number(params.id),
    },
    data: {
      name: body.name,
      description: body.description,
      id_subcomponents: body.id_subcomponents,
    },
  });
  return NextResponse.json(criteria, { status: 200 });
};
