import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import type { Component } from "@prisma/client";
import { createActivityLog } from "@/lib/activityLog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
const prisma = new PrismaClient();

export const POST = async (request: Request) => {
  const body: Component = await request.json();
  const component = await prisma.component.create({
    data: {
      name: body.name,
      description: body.description,
      weight: Number(body.weight),
      component_number: Number(body.component_number),
      id_team: Number(body.id_team),
      id_LKE: body.id_LKE,
    },
  });

  const componentScore = await prisma.componentScore.create({
    data: {
      nilai: null,
      id_components: component.id,
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
    "Komponen Ditambah",
    "Components",
    component.id,
    Number(session.user.id)
  );

  return NextResponse.json(
    { component, componentScore, activityLog },
    { status: 201 }
  );
};
