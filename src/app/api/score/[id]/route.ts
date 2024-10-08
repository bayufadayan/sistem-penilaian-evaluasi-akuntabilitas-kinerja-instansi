import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const PATCH = async (request: Request, { params }: { params: { id: string } }) => {
  try {
    const body = await request.json();

    const updatedScore = await prisma.score.update({
      where: {
        id: Number(params.id),
      },
      data: {
        score: body.score,
        notes: body.notes,
        id_users: body.id_users,
      },
    });

    return NextResponse.json(updatedScore, { status: 200 });
  } catch (error) {
    console.error("Error updating score:", error);
    return NextResponse.json({ error: "Failed to update score" }, { status: 500 });
  }
};
