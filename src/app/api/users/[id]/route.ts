import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { createActivityLog } from "@/lib/activityLog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";

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
  const activityLog = createActivityLog(
    `Akun ${user.name} dihapus`,
    "User",
    user.id,
    Number(session.user.id)
  );

  const serializedUser = {
    ...user,
    nip: user.nip.toString(),
  };
  return NextResponse.json({ serializedUser, activityLog }, { status: 200 });
};

export const PATCH = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const body = await request.json();

    if (body.updateType === "id_team") {
      const userBeforeUpdate = await prisma.user.findUnique({
        where: {
          id: Number(params.id),
        },
      });

      // Hanya update id_team
      const user = await prisma.user.update({
        where: {
          id: Number(params.id),
        },
        data: {
          id_team: body.id_team,
        },
      });

      const team = await prisma.team.findUnique({
        where: { id: user.id_team },
        select: {
          id: true,
          name: true,
          users: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!userBeforeUpdate) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const teamBeforeUpdate = await prisma.team.findUnique({
        where: { id: userBeforeUpdate.id_team },
        select: {
          id: true,
          name: true,
          users: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      const session = await getServerSession(authOptions);
      if (!session || !session.user || !session.user.id) {
        return NextResponse.json(
          { message: "User not authenticated" },
          { status: 401 }
        );
      }

      const activityLog = createActivityLog(
        `Akun ${user.name} dipindahkan dari Tim ${teamBeforeUpdate?.name} ke Tim ${team?.name}`,
        "User",
        user.id,
        Number(session.user.id)
      );

      const responseUser = {
        ...user,
        nip: user.nip?.toString(),
      };

      return NextResponse.json({ responseUser, activityLog }, { status: 200 });
    } else {
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

      const activityLog = createActivityLog(
        `Akun ${user.name} diupdate`,
        "User",
        user.id,
        Number(session.user.id)
      );

      const responseUser = {
        ...user,
        nip: user.nip.toString(),
      };

      return NextResponse.json({ responseUser, activityLog }, { status: 200 });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Error updating user" },
      { status: 500 }
    );
  }
};
