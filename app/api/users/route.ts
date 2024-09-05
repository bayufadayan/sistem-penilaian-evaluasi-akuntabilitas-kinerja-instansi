import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import type { User } from "@prisma/client";
const prisma = new PrismaClient();

export const POST = async (request: Request) => {
    const body: User = await request.json();
    const user = await prisma.user.create({
        data: {
            email: body.email,
            password: body.password,
            nip: BigInt(body.nip),
            name: body.name,
            role: body.role,
            gender: body.gender,
            status: body.status,
            id_team: body.id_team,
        }
    });

    const responseUser = {
        ...user,
        nip: user.nip.toString(), // Konversi BigInt menjadi string di sini
    };
    return NextResponse.json(responseUser, { status: 201 });
}