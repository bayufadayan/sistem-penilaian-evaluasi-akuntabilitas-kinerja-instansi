import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import type { Team, User } from "@prisma/client";
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
