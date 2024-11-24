import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const PATCH = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const body = await request.json();

    // Update data skor
    await prisma.score.update({
      where: {
        id: Number(params.id),
      },
      data: {
        score: body.score,
        notes: body.notes,
        id_users: body.id_users,
      },
    });

    // Fetch data lengkap setelah update
    const updatedScore = await prisma.score.findUnique({
      where: { id: Number(params.id) },
      include: {
        criteria: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            Evidence: true,
          },
        },
      },
    });

    return NextResponse.json(updatedScore, { status: 200 });
  } catch (error) {
    console.error("Error updating score:", error);
    return NextResponse.json(
      { error: "Failed to update score" },
      { status: 500 }
    );
  }
};

export const GET = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const score = await prisma.score.findUnique({
      where: { id: Number(params.id) },
      include: {
        criteria: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            Evidence: true,
          },
        },
      },
    });

    if (!score) {
      return NextResponse.json({ error: "Score not found" }, { status: 404 });
    }

    return NextResponse.json(score, { status: 200 });
  } catch (error) {
    console.error("Error fetching score:", error);
    return NextResponse.json(
      { error: "Failed to fetch score" },
      { status: 500 }
    );
  }
};
