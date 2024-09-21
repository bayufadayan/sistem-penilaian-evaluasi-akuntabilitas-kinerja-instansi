import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const PATCH = async (request: Request, { params }: { params: { id: string } }) => {
    try {
        const body = await request.json();
        const subComponentScore = await prisma.subComponentScore.findFirst({
            where: {
                id_subcomponents: Number(params.id), 
            },
        });

        if (!subComponentScore) {
            return NextResponse.json({ error: "SubComponentScore not found" }, { status: 404 });
        }

        const updatedSubComponentScore = await prisma.subComponentScore.update({
            where: {
                id: subComponentScore.id,
            },
            data: {
                nilaiAvgOlah: body.nilaiAvgOlah,
                persentase: body.persentase,
                grade: body.grade,
                nilai: body.nilai,
            },
        });

        return NextResponse.json(updatedSubComponentScore, { status: 200 });
    } catch (error) {
        console.error("Error updating subcomponent score:", error);
        return NextResponse.json({ error: "Failed to update subcomponent score" }, { status: 500 });
    }
};


export const GET = async (request: Request, { params }: { params: { id: string } }) => {
    try {
        const subComponentScore = await prisma.subComponentScore.findFirst({
            where: {
                id_subcomponents: Number(params.id),
            },
        });

        if (!subComponentScore) {
            return NextResponse.json({ error: "SubComponentScore not found" }, { status: 404 });
        }

        return NextResponse.json(subComponentScore, { status: 200 });
    } catch (error) {
        console.error("Error fetching subcomponent score:", error);
        return NextResponse.json({ error: "Failed to fetch subcomponent score" }, { status: 500 });
    }
};
