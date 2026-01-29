import { NextResponse } from "next/server";
import type { Component } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createActivityLog } from "@/lib/activityLog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";

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
    `Komponen ${component.name} ditambah`,
    "Components",
    component.id,
    Number(session.user.id)
  );

  return NextResponse.json(
    { component, componentScore, activityLog },
    { status: 201 }
  );
};

  export const GET = async () => {
    try {
      const component = await prisma.component.findMany({
        select: {
          id: true,
          name: true,
          subComponents: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });     
    return NextResponse.json({ component, }, { status: 200 });
  } catch (error) {
    console.error("Error fetching component:", error);
    return NextResponse.json(
      { error: "Failed to fetch component" },
      { status: 500 }
    );
  }
};
