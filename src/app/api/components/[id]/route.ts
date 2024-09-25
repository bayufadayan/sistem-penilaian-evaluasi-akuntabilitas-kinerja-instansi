// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import type { Component } from "@prisma/client";
const prisma = new PrismaClient();

export const DELETE = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const component = await prisma.component.delete({
    where: {
      id: Number(params.id),
    },
  });

  return NextResponse.json(component, { status: 200 });
};

export const PATCH = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const body: Component = await request.json();
  const component = await prisma.component.update({
    where: {
      id: Number(params.id),
    },
    data: {
      name: body.name,
      description: body.description,
      weight: body.weight,
      id_team: body.id_team,
      id_LKE: body.id_LKE,
    },
  });
  return NextResponse.json(component, { status: 200 });
};

export const GET = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const componentId = Number(params.id);
    if (Number.isNaN(componentId)) {
      return NextResponse.json(
        { error: "Invalid component ID" },
        { status: 400 }
      );
    }

    const component = await prisma.component.findUnique({
      where: { id: componentId },
      include: {
        subComponents: {
          include: {
            subComponentScore: true,
          },
        },
        componentScore: true, 
      },
    });

    if (!component) {
      return NextResponse.json(
        { error: "Component not found" },
        { status: 404 }
      );
    }

    const totalSubComponentScore = component.subComponents.reduce(
      (acc, subComponent) => {
        const subComponentScore =
          subComponent.subComponentScore?.[0]?.nilai ?? 0;
        return acc + subComponentScore;
      },
      0
    );

    const componentScore = Number.parseFloat(totalSubComponentScore.toFixed(2));

    return NextResponse.json({ component, componentScore }, { status: 200 });
  } catch (error) {
    console.error("Error fetching component score:", error);
    return NextResponse.json(
      { error: "Failed to fetch component score" },
      { status: 500 }
    );
  }
};
