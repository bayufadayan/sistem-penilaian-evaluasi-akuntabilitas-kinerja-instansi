import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import type { Criteria } from "@prisma/client";
import {createActivityLog} from "@/lib/activityLog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";

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

  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json(
      { message: "User not authenticated" },
      { status: 401 }
    );
  }
  const activityLog = createActivityLog(
    "Kriteria dibuat",
    "User",
    criteria.id,
    Number(session.user.id)
  );

  return NextResponse.json({ criteria, score, activityLog }, { status: 201 });
};
