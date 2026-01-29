import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const GET = async () => {
  try {
    // request.url;
    const evaluationSheetCount = await prisma.evaluationSheet.count();

    return NextResponse.json(
      { evaluationSheetCount },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 }
    );
  }
};
