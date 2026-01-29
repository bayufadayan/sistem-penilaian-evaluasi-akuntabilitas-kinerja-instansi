// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type NextRequest, NextResponse } from "next/server";
import type { SubComponent } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createActivityLog } from "@/lib/activityLog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";

export const DELETE = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const subComponent = await prisma.subComponent.delete({
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
    `Sub komponen ${subComponent.name} dihapus`,
    "SubComponents",
    Number(params.id),
    Number(session.user.id)
  );

  return NextResponse.json({ subComponent, activityLog }, { status: 200 });
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

  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json(
      { message: "User not authenticated" },
      { status: 401 }
    );
  }
  const activityLog = createActivityLog(
    `Sub komponen ${subComponent.name} diupdate`,
    "SubComponent",
    subComponent.id,
    Number(session.user.id)
  );
  return NextResponse.json({ subComponent, activityLog }, { status: 200 });
};

export const GET = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const id = Number.parseInt(params.id);

  try {
    const subComponent = await prisma.subComponent.findUnique({
      where: { id },
      include: {
        criteria: {
          include: {
            score: true,
          },
        },
        component: true,
        subComponentScore: true,
      },
    });

    if (!subComponent) {
      return NextResponse.json(
        { message: "Sub Component not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(subComponent);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};
