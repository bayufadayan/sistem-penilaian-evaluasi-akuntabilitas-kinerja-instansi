import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const GET = async (
    request: Request,
    { params }: { params: { id: string } }
) => {
    try {
        const evaluationId = params.id;
    
        // Cari komponen dengan component_number terkecil
        const component = await prisma.component.findFirst({
            where: {
                id_LKE: evaluationId,
            },
            orderBy: {
                component_number: "asc",
            },
            include: {
                subComponents: true,
            },
        });
    
        if (!component) {
            return NextResponse.json(
                { error: "Component not found" },
                { status: 404 }
            );
        }
    
        return NextResponse.json({ component }, { status: 200 });
    } catch (error) {
        console.error("Error fetching component by LKE ID:", error);
        return NextResponse.json(
            { error: "Failed to fetch component by LKE ID" },
            { status: 500 }
        );
    }
};
