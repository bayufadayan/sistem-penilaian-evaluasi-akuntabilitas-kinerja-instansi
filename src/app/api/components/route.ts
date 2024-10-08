import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import type { Component } from "@prisma/client";
const prisma = new PrismaClient();

export const POST = async (request: Request) => {
    const body: Component = await request.json();
    const component = await prisma.component.create({
        data: {
            name: body.name,
            description: body.description,
            weight: Number(body.weight),
            component_number: Number(body.component_number),
            id_team: Number(body.id_team),
            id_LKE: body.id_LKE
        }
    });

    const componentScore = await prisma.componentScore.create({
        data: {
            nilai: null,
            id_components: component.id,
        },
    });

    return NextResponse.json({component, componentScore}, { status: 201 });
}

