import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import type { Criteria } from "@prisma/client";

const prisma = new PrismaClient();

export const POST = async (request: Request) => {
  const body: Criteria = await request.json();

  const criteria = await prisma.criteria.create({
    data: {
      name: body.name,
      description: body.description,
      criteria_number: Number(body.criteria_number),
      id_subcomponents: body.id_subcomponents,
    },
  });


  const score = await prisma.score.create({
    data: {
      score: "",
      id_criterias: criteria.id,
      id_users: null,
      notes: null,
    },
  });

  return NextResponse.json({ criteria, score }, { status: 201 });
};
