import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import type { Criteria } from "@prisma/client";
const prisma = new PrismaClient();

export const POST = async (request: Request) => {
    const body: Criteria = await request.json();
    const criteria = await prisma.criteria.create({
        data: {
            name: body.name,
            description: body.description,
            id_subcomponents: body.id_subcomponents,
        }
    });

    return NextResponse.json(criteria, { status: 201 });
}

