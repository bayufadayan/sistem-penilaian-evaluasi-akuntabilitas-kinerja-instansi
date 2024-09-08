import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import type { Team } from "@prisma/client";
const prisma = new PrismaClient();

export const POST = async (request: Request) => {
  const body: Team = await request.json();
  const team = await prisma.team.create({
    data: {
      name: body.name,
    },
  });

  return NextResponse.json(team, { status: 201 });
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