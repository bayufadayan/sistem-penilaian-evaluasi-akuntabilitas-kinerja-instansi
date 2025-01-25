// /api/score/[id]/detail.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const GET = async () => {
  try {
    const lastUser = await prisma.evaluationSheetScore.findFirst({
      orderBy: {
        id: "desc",
      },
      where: {
        evaluation: {
          status: "IN_PROGRESS",
        },
      },
      include: {
        evaluation: true,
      },
    });

    return NextResponse.json(lastUser, { status: 200 });
  } catch (error) {
    console.error("Error fetching score details:", error);
    return NextResponse.json(
      { error: "Failed to fetch details" },
      { status: 500 }
    );
  }
};
