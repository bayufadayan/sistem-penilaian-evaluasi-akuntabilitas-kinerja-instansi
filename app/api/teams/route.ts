import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import type { Team } from "@prisma/client";
const prisma = new PrismaClient();

export const POST = async (request: Request) => {
    const body: Team = await request.json();
    const team = await prisma.team.create({
        data: {
            name: body.name,
        }
    });

    return NextResponse.json(team, { status: 201 });
}