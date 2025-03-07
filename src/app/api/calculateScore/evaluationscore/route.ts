// /api/score/[id]/detail.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const GET = async () => {
  try {
    const lastUser = await prisma.evaluationSheetScore.findMany({
      orderBy: {
        nilai: "desc",
      },
      where: {
        nilai: {
          not: null, 
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
