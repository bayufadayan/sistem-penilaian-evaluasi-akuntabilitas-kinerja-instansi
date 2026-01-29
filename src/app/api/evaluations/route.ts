import { NextResponse } from "next/server";
import type { EvaluationSheet } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createActivityLog } from "@/lib/activityLog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import sendMail from "@/lib/sendMail";

export const POST = async (request: Request) => {
  const body: EvaluationSheet = await request.json();
  const evaluationSheet = await prisma.evaluationSheet.create({
    data: {
      title: body.title,
      date_start: body.date_start,
      date_finish: body.date_finish,
      description: body.description,
      status: body.status,
      year: body.year,
    },
  });

  const evaluationSheetScore = await prisma.evaluationSheetScore.create({
    data: {
      nilai: null,
      grade: null,
      id_LKE: evaluationSheet.id,
    },
  });

  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json(
      { message: "User not authenticated" },
      { status: 401 }
    );
  }

  if (body.status === "IN_PROGRESS") {
    const activeUsers = await prisma.user.findMany({
      where: { status: "ACTIVE" },
      select: { email: true },
    });

    const settings = await prisma.settings.findFirst();
    const adminPhone = settings?.adminPhone;
    const appName = settings?.appName || "Aplikasi";

    // Membuat pesan untuk WhatsApp
    const message = `Hai, Admin ${appName},%0A%0ASaya [Tulis nama anda], dari bagian [sektor anda bekerja] ingin menanyakan perihal perubahan status LKE ${evaluationSheet.title}`;
    const waLink = `https://wa.me/62${adminPhone}?text=${message}`;

    // Format tanggal
    const startDate = evaluationSheet.date_start
      ? new Date(evaluationSheet.date_start).toLocaleDateString()
      : null;
    const endDate = evaluationSheet.date_finish
      ? new Date(evaluationSheet.date_finish).toLocaleDateString()
      : null;

    // Menentukan pesan berdasarkan status
    let statusMessage = `
      <p style="color: #4a5568; margin-bottom: 16px;">Berikut adalah status terbaru: <strong>${evaluationSheet.status}</strong></p>
    `;

    if (evaluationSheet.status === "IN_PROGRESS") {
      statusMessage += `
        <p style="color: #4a5568; margin-bottom: 8px;">Tanggal mulai: <strong>${startDate}</strong></p>
        <p style="color: #4a5568; margin-bottom: 16px;">Tanggal selesai: <strong>${endDate}</strong></p>
        <div style="margin-top: 24px;">
          <a href="${process.env.NEXTAUTH_URL}/sheets/${evaluationSheet.id}" style="display: inline-block; background-color: #4299e1; color: white; font-weight: bold; padding: 12px 16px; border-radius: 4px; text-decoration: none; transition: background-color 0.2s;">Buka Web</a>
        </div>
      `;
    }

    const emailMessage = `
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); padding: 24px;">
        <h1 style="font-size: 24px; font-weight: bold; color: #2d3748; margin-bottom: 16px;">Pemberitahuan Perubahan Status</h1>
        <p style="color: #4a5568; margin-bottom: 8px;">Status LKE berjudul <strong>${evaluationSheet.title}</strong> telah berubah.</p>
        ${statusMessage}
        <p style="color: #4a5568;">Jika Anda tidak mengharapkan perubahan ini, harap segera menghubungi admin.</p>
        <div style="margin-top: 24px;">
          <a href="${waLink}" style="display: inline-block; background-color: #25D366; color: white; font-weight: bold; padding: 12px 16px; border-radius: 4px; text-decoration: none; transition: background-color 0.2s;">Hubungi Admin via WhatsApp</a>
        </div>
      </div>
    `;

    // Kirim email ke semua pengguna aktif
    for (const user of activeUsers) {
      await sendMail(
        user.email,
        `Status Update for LKE: ${evaluationSheet.title}`,
        emailMessage
      );
    }
  }

  const activityLog = createActivityLog(
    `LKE Baru dibuat dengan Judul ${evaluationSheet.title}`,
    "User",
    0,
    Number(session.user.id)
  );
  return NextResponse.json(
    { evaluationSheet, evaluationSheetScore, activityLog },
    { status: 201 }
  );
};

export const GET = async () => {
  try {
    const sheets = await prisma.evaluationSheet.findMany({
      include: {
        evaluationSheetScore: true,
      },
    });
    return NextResponse.json(sheets);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch evaluation sheets" },
      { status: 500 }
    );
  }
};
