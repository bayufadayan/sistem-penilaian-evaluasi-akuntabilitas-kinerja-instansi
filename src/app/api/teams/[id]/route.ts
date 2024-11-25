import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import type { Team } from "@prisma/client";
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

  return NextResponse.json(team, { status: 200 });
};

export const PATCH = async (request: Request, {params}: {params: {id: string}}) =>{
  const body: Team = await request.json();
  const team = await prisma.team.update({
      where:{
          id: Number(params.id)
      },
      data:{
          name: body.name,
      }
  });
  return NextResponse.json(team, {status: 200});
}

export const GET = async (request: Request, { params }: { params: { id: string } }) => {
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
    return NextResponse.json({ error: "Failed to fetch team" }, { status: 500 });
  }
};
