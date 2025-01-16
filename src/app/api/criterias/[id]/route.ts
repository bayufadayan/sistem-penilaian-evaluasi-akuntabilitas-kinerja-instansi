/* eslint-disable @typescript-eslint/no-unused-vars */
import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import type { Criteria } from "@prisma/client";
import { createActivityLog } from "@/lib/activityLog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
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

  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json(
      { message: "User not authenticated" },
      { status: 401 }
    );
  }
  const activityLog = createActivityLog(
    `Kriteria ${criteria.name} dihapus`,
    "User",
    criteria.id,
    Number(session.user.id)
  );

  return NextResponse.json({ criteria, activityLog }, { status: 200 });
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

  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json(
      { message: "User not authenticated" },
      { status: 401 }
    );
  }
  const activityLog = createActivityLog(
    `Kriteria ${criteria.name} diupdate`,
    "User",
    criteria.id,
    Number(session.user.id)
  );
  return NextResponse.json({criteria, activityLog}, { status: 200 });
};
