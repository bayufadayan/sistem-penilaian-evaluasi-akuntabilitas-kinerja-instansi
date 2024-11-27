import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import type { Team } from "@prisma/client";
import { createActivityLog } from "@/lib/activityLog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
const prisma = new PrismaClient();

export const DELETE = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const team = await prisma.team.delete({
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
    "Tim dihapus",
    "Team",
    Number(params.id),
    Number(session.user.id)
  );

  return NextResponse.json({ team, activityLog }, { status: 200 });
};

export const PATCH = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const body: Team = await request.json();
  const team = await prisma.team.update({
    where: {
      id: Number(params.id),
    },
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
    "Tim diupdate",
    "Team",
    Number(params.id),
    Number(session.user.id)
  );

  return NextResponse.json({ team, activityLog }, { status: 200 });
};
export const GET = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const teamId = parseInt(params.id, 10);

    if (isNaN(teamId)) {
      return NextResponse.json({ error: "Invalid team ID" }, { status: 400 });
    }

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: {
        id: true,
        name: true,
        users: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    return NextResponse.json(team, { status: 200 });
  } catch (error) {
    console.error("Error fetching team:", error);
    return NextResponse.json(
      { error: "Failed to fetch team" },
      { status: 500 }
    );
  }
};
