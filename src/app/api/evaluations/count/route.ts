import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


export const GET = async () => {
  try {

    const evaluationSheetCount = await prisma.evaluationSheet.count();

    return NextResponse.json({ evaluationSheetCount  }, { status: 200 });
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 }
    );
  }
};