import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const PATCH = async (
    request: Request,
    { params }: { params: { id: string } }
) => {
    try {
        const body = await request.json();

        const componentId = Number(params.id);
        if (isNaN(componentId)) {
            return NextResponse.json(
                { error: "Invalid component ID" },
                { status: 400 }
            );
        }

        if (typeof body.nilai !== "number" || body.nilai < 0) {
            return NextResponse.json(
                { error: "Invalid score value" },
                { status: 400 }
            );
        }

        const componentScoreToUpdate = await prisma.componentScore.findFirst({
            where: {
                id_components: componentId,
            },
        });

        if (!componentScoreToUpdate) {
            return NextResponse.json({ error: "Component score not found" }, { status: 404 });
        }

        const updatedComponentScore = await prisma.componentScore.update({
            where: {
                id: componentScoreToUpdate.id,
            },
            data: {
                nilai: body.nilai,
            },
        });

        return NextResponse.json(updatedComponentScore, { status: 200 });
    } catch (error) {
        console.error("Error updating component score:", error);
        return NextResponse.json(
            { error: "Failed to update component score" },
            { status: 500 }
        );
    }
};

export const GET = async (
    request: Request,
    { params }: { params: { id: string } }
) => {
    try {
        const componentId = Number(params.id);
        if (isNaN(componentId)) {
            return NextResponse.json(
                { error: "Invalid component ID" },
                { status: 400 }
            );
        }

        const subComponents = await prisma.subComponent.findMany({
            where: { id_components: componentId },
            include: { subComponentScore: true },
        });

        const totalScore = subComponents.reduce((acc, subComponent) => {
            const score = subComponent.subComponentScore?.[0];
            const nilai = score?.nilai || 0;
            return acc + nilai;
        }, 0);

        return NextResponse.json({ componentScore: totalScore }, { status: 200 });
    } catch (error) {
        console.error("Error calculating component score:", error);
        return NextResponse.json(
            { error: "Failed to calculate component score" },
            { status: 500 }
        );
    }
};
