import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import type { Team } from "@prisma/client";
import {createActivityLog} from "@/lib/activityLog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
const prisma = new PrismaClient();

export const POST = async (request: Request) => {
  const body: Team = await request.json();
  const team = await prisma.team.create({
    data: {
      name: body.name,
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
    "Tim baru di buat",
    "User",
    body.id,
    Number(session.user.id)
  );

  return NextResponse.json({team, activityLog}, { status: 201 });
};

export const GET = async () => {
  try {
    const teams = await prisma.team.findMany();

    return NextResponse.json(teams, { status: 200 });
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 }
    );
  }
};
