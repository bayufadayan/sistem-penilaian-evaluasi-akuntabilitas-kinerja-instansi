import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import type { SubComponent } from "@prisma/client";
import { createActivityLog } from "@/lib/activityLog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
const prisma = new PrismaClient();

export const POST = async (request: Request) => {
  const body: SubComponent = await request.json();
  const subcomponent = await prisma.subComponent.create({
    data: {
      name: body.name,
      description: body.description,
      weight: Number(body.weight),
      subcomponent_number: Number(body.subcomponent_number),
      id_components: Number(body.id_components),
    },
  });

  const subComponentScore = await prisma.subComponentScore.create({
    data: {
      nilaiAvgOlah: null,
      nilai: null,
      persentase: null,
      grade: null,
      id_subcomponents: subcomponent.id,
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
    "Sub komponen ditambahkan",
    "SubComponens",
    body.id,
    Number(session.user.id)
  );

  return NextResponse.json(
    { subcomponent, subComponentScore, activityLog },
    { status: 201 }
  );
};
