import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';
export const GET = async () => {
    try {
      const sheets = await prisma.activityLog.findMany();
      return NextResponse.json(sheets);
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to fetch evaluation sheets" },
        { status: 500 }
      );
    }
  };
  