import { NextResponse } from "next/server";
import type { User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/utils";

export const POST = async (request: Request) => {
    const body: User = await request.json();

    const existingUser = await prisma.user.findUnique({
        where: {
            email: body.email,
        },
    });
    if (existingUser) {
        return NextResponse.json(
            { message: "Email sudah terdaftar, silakan daftarkan dengan email lain" },
            { status: 400 }
        );
    }
    
    const hashedPassword = await hashPassword(body.password);
    const user = await prisma.user.create({
        data: {
            email: body.email,
            password: hashedPassword,
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
        nip: user.nip.toString(),
    };
    return NextResponse.json(responseUser, { status: 201 });
}