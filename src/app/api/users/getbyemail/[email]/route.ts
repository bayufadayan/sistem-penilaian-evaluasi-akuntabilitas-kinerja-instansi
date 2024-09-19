import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const GET = async (
    req: NextRequest,
    context: { params: { email: string } }
) => {
    const email = context.params.email
    const user = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });
    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const serializedUser = {
        ...user,
        id: user.id.toString(),
        nip: user.nip ? user.nip.toString() : null,
    };

    return NextResponse.json(serializedUser);
};