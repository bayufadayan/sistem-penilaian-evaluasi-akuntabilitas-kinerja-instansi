import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import type { User } from "@prisma/client";
const prisma = new PrismaClient();

export const PATCH = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const body: User = await request.json();
  const product = await prisma.user.update({
    where: {
      id: Number(params.id),
    },
    data: {
      email: body.email,
      password: body.password,
      nip: BigInt(body.nip),
      name: body.name,
      role: body.role,
      gender: body.gender,
      status: body.status,
      id_team: body.id_team,
    },
  });
  return NextResponse.json(product, { status: 200 });
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
