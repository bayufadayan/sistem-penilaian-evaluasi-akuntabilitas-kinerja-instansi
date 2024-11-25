// /api/score/[id]/detail.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const GET = async (
    request: Request,
    { params }: { params: { id: string } }
) => {
    try {
        const scoreId = Number(params.id);

        if (Number.isNaN(scoreId)) {
            return NextResponse.json({ error: "Invalid score ID" }, { status: 400 });
        }

        const score = await prisma.score.findUnique({
            where: { id: scoreId },
            include: {
                criteria: {
                    include: {
                        subComponent: {
                            include: {
                                component: {
                                    include: {
                                        evaluation: true, // Includes LKE (EvaluationSheet)
                                    },
                                },
                            },
                        },
                    },
                },
                user: true, // Includes user details (name and email)
                Evidence: true, // Includes evidence details
            },
        });

        if (!score) {
            return NextResponse.json({ error: "Score not found" }, { status: 404 });
        }

        const details = {
            LKE: score.criteria.subComponent.component.evaluation?.title || "-",
            Komponen: score.criteria.subComponent.component.name || "-",
            SubKomponen: score.criteria.subComponent.name || "-",
            Kriteria: score.criteria.name || "-",
            Nilai: score.score || "N/A",
            Notes: score.notes || "-",
            EvidenceCount: score.Evidence.length,
            UserName: score.user?.name || "Tidak Diketahui",
            UserEmail: score.user?.email || "Tidak Diketahui",
        };

        return NextResponse.json(details, { status: 200 });
    } catch (error) {
        console.error("Error fetching score details:", error);
        return NextResponse.json(
            { error: "Failed to fetch details" },
            { status: 500 }
        );
    }
};
