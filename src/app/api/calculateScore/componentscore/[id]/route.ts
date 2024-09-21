import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const PATCH = async (request: Request, { params }: { params: { id: string } }) => {
    try {
        const body = await request.json();

        const componentId = Number(params.id);
        if (isNaN(componentId)) {
            return NextResponse.json({ error: "Invalid component ID" }, { status: 400 });
        }

        if (typeof body.nilai !== 'number' || body.nilai < 0) {
            return NextResponse.json({ error: "Invalid score value" }, { status: 400 });
        }

        const updatedComponentScore = await prisma.componentScore.update({
            where: {
                id: componentId,
            },
            data: {
                nilai: body.nilai,
            },
        });

        return NextResponse.json(updatedComponentScore, { status: 200 });
    } catch (error) {
        console.error("Error updating component score:", error);
        return NextResponse.json({ error: "Failed to update component score" }, { status: 500 });
    }
};

export const GET = async (request: Request, { params }: { params: { id: string } }) => {
    try {
        const componentId = Number(params.id);
        if (isNaN(componentId)) {
            return NextResponse.json({ error: "Invalid component ID" }, { status: 400 });
        }

        const componentScore = await prisma.componentScore.findUnique({
            where: {
                id: componentId,
            },
        });

        if (!componentScore) {
            return NextResponse.json({ error: "Component score not found" }, { status: 404 });
        }

        return NextResponse.json(componentScore, { status: 200 });
    } catch (error) {
        console.error("Error fetching component score:", error);
        return NextResponse.json({ error: "Failed to fetch component score" }, { status: 500 });
    }
};
