import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import type { User } from "@prisma/client";
const prisma = new PrismaClient();
import {createActivityLog} from "@/lib/activityLog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json(
      { message: "User not authenticated" },
      { status: 401 }
    );
  }
  const activityLog = createActivityLog("Akun dihapus", "User", user.id, Number(session.user.id))

  const serializedUser = {
    ...user,
    nip: user.nip.toString(), 
  };
  return NextResponse.json({serializedUser, activityLog}, { status: 200 });
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

  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json(
      { message: "User not authenticated" },
      { status: 401 }
    );
  }
  const activityLog = createActivityLog("Akun diperbarui", "User", user.id, Number(session.user.id))
  
  const responseUser = {
    ...user,
    nip: user.nip.toString(),
};
return NextResponse.json({responseUser, activityLog}, { status: 201 });
};
