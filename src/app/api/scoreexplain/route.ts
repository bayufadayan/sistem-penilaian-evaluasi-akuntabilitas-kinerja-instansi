import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const GET = async () => {
    try {
      const scoreExplain = await prisma.explainingScore.findMany({
        select: {
          id: true,
          section: true,
          pilihan: true,
          nilai: true,
          penjelasan: true,
        },
      });
      return NextResponse.json(scoreExplain);
    } catch (error) {
      return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
  };
