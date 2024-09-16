import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import type { Evidence } from "@prisma/client";
const prisma = new PrismaClient();

export const POST = async (request: Request) => {
  const body: Evidence = await request.json();
  const evidence = await prisma.evidence.create({
    data: {
      file_name: body.file_name,
      file_type: body.file_type,
      file_size: body.file_size,
      file_path: body.file_path,
      public_path: body.public_path,
      date_uploaded_at: body.date_uploaded_at,
      id_score: body.id_score,
    },
  });

  return NextResponse.json(evidence, { status: 201 });
};

export async function GET() {
  try {
    const allEvidence = await prisma.evidence.findMany();

    return NextResponse.json({ evidence: allEvidence });
  } catch (error) {
    console.error("Error fetching evidence:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data evidence" },
      { status: 500 }
    );
  }
}