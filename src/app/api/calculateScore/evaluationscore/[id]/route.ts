import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const PATCH = async (
    request: Request,
    { params }: { params: { id: string } }
) => {
    try {
        // Parsing body dari request
        const body = await request.json();

        const evaluationId = params.id;
        if (typeof body.grade !== "string") {
            return NextResponse.json(
                { error: "ID evaluasi tidak valid" },
                { status: 400 }
            );
        }

        // Pastikan nilai dan grade dikirim dan dalam format yang benar
        if (typeof body.nilai !== "number" || typeof body.grade !== "string") {
            return NextResponse.json(
                { error: "Nilai atau grade tidak valid" },
                { status: 400 }
            );
        }

        const updatedEvaluationScore = await prisma.evaluationSheetScore.updateMany(
            {
                where: {
                    id_LKE: evaluationId,
                },
                data: {
                    nilai: body.nilai,
                    grade: body.grade,
                },
            }
        );

        return NextResponse.json(updatedEvaluationScore, { status: 200 });
    } catch (error) {
        console.error("Error updating score:", error);
        return NextResponse.json(
            { error: "Gagal mengupdate nilai evaluasi" },
            { status: 500 }
        );
    }
};
