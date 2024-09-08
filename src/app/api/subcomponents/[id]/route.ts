import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import type { SubComponent } from "@prisma/client";
const prisma = new PrismaClient();

export const DELETE = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const subComponent = await prisma.subComponent.delete({
    where: {
      id: Number(params.id),
    },
  });

  return NextResponse.json(subComponent, { status: 200 });
};

export const PATCH = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const body: SubComponent = await request.json();
  const subComponent = await prisma.subComponent.update({
    where: {
      id: Number(params.id),
    },
    data: {
      name: body.name,
      description: body.description,
      weight: body.weight,
      id_components: body.id_components,
    },
  });
  return NextResponse.json(subComponent, { status: 200 });
};
