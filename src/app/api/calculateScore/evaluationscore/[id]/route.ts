import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const PATCH = async (request: Request, { params }: { params: { id: string } }) => {
    try {
        const body = await request.json();

        const updatedEvaluationScore = await prisma.evaluationSheetScore.update({
            where: {
                id: Number(params.id),
            },
            data: {
                nilai: body.nilai,
                grade: body.grade,
            },
        });

        return NextResponse.json(updatedEvaluationScore, { status: 200 });
    } catch (error) {
        console.error("Error updating score:", error);
        return NextResponse.json({ error: "Failed to update score" }, { status: 500 });
    }
};
