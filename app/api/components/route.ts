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
            weight: Number(body.weight)
        }
    });

    return NextResponse.json(component, { status: 201 });
}

