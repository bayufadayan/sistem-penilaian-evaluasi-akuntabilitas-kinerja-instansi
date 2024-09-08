import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import type { User } from "@prisma/client";
const prisma = new PrismaClient();

export const GET = async (
  req: NextRequest,
  context: { params: { id: string } }
) => {
  const id = Number(context.params.id) || 0;
  const user = await prisma.user.findFirst({
    where: {
      id: id,
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

  // Mengembalikan respons JSON
  return NextResponse.json(serializedUser);
};

export const DELETE = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const user = await prisma.user.delete({
    where: {
      id: Number(params.id),
    },
  });

  const serializedUser = {
    ...user,
    nip: user.nip.toString(), // Convert BigInt nip to string
  };
  return NextResponse.json(serializedUser, { status: 200 });
};

export const PATCH = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const body: User = await request.json();
  const user = await prisma.user.update({
    where: {
      id: Number(params.id),
    },
    data: {
      email: body.email,
      nip: BigInt(body.nip),
      name: body.name,
      role: body.role,
      gender: body.gender,
      status: body.status,
      id_team: body.id_team,
    },
  });
  
  const responseUser = {
    ...user,
    nip: user.nip.toString(),
};
return NextResponse.json(responseUser, { status: 201 });
};
