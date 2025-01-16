import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import {createActivityLog} from "@/lib/activityLog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";

const prisma = new PrismaClient();

// GET Settings
export const GET = async () => {
  try {
    // Ambil data settings baris pertama
    const settings = await prisma.settings.findFirst();
    return NextResponse.json(settings || {}, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings." },
      { status: 500 }
    );
  }
};

// POST (Update or Create Settings)
export const POST = async (request: Request) => {
  try {
    const {
      appName,
      appLogoLogin,
      appLogoDashboard,
      appLogoFooter,
      favicon,
      adminEmail,
      adminMailPass,
      adminPhone,
      guideLink,
    } = await request.json();

    const updatedSettings = await prisma.settings.upsert({
      where: { id: 1 },
      update: {
        appName,
        appLogoLogin,
        appLogoDashboard,
        appLogoFooter,
        favicon,
        adminEmail,
        adminMailPass,
        adminPhone,
        guideLink,
      },
      create: {
        appName,
        appLogoLogin,
        appLogoDashboard,
        appLogoFooter,
        favicon,
        adminEmail,
        adminMailPass,
        adminPhone,
        guideLink,
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
      "Pengaturan aplikasi diupdate",
      "User",
      0,
      Number(session.user.id)
    );

    return NextResponse.json({updatedSettings, activityLog}, { status: 200 });
  } catch (error) {
    console.error("Failed to save settings:", error);
    return NextResponse.json(
      { error: "Failed to save settings." },
      { status: 500 }
    );
  }
};
