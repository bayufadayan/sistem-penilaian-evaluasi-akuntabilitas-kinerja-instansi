import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import type { SubComponent } from "@prisma/client";
const prisma = new PrismaClient();

export const POST = async (request: Request) => {
    const body: SubComponent = await request.json();
    const subcomponent = await prisma.subComponent.create({
        data: {
            name: body.name,
            description: body.description,
            weight: Number(body.weight),
            subcomponent_number: Number(body.subcomponent_number),
            id_components: Number(body.id_components),
        }
    });

    return NextResponse.json(subcomponent, { status: 201 });
}

