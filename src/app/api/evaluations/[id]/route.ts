// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type NextRequest, NextResponse } from "next/server";
import type { EvaluationSheet } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createActivityLog } from "@/lib/activityLog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import sendMail from "@/lib/sendMail";

export const GET = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const id = params.id;

  try {
    const evaluationSheet = await prisma.evaluationSheet.findUnique({
      where: { id },
      include: {
        components: {
          where: { id_LKE: id },
          include: {
            componentScore: true,
            team: true,
            subComponents: {
              include: {
                subComponentScore: true,
                criteria: {
                  include: {
                    score: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!evaluationSheet) {
      return NextResponse.json(
        { message: "EvaluationSheet not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(evaluationSheet);
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const evaluationSheet = await prisma.evaluationSheet.delete({
    where: {
      id: params.id,
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
    `LKE berjudul ${evaluationSheet.title} dihapus`,
    "Evaluations",
    0,
    Number(session.user.id)
  );

  return NextResponse.json({ evaluationSheet, activityLog }, { status: 200 });
};

export const PATCH = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const body: EvaluationSheet = await request.json();
  const oldEvaluationSheet = await prisma.evaluationSheet.findUnique({
    where: { id: params.id },
  });

  if (!oldEvaluationSheet) {
    return NextResponse.json(
      { message: "EvaluationSheet not found" },
      { status: 404 }
    );
  }

  const evaluationSheet = await prisma.evaluationSheet.update({
    where: {
      id: params.id,
    },
    data: {
      title: body.title,
      date_start: body.date_start,
      date_finish: body.date_finish,
      description: body.description,
      status: body.status,
      year: body.year,
    },
  });

  if (
    (oldEvaluationSheet.status !== "IN_PROGRESS" &&
      evaluationSheet.status === "IN_PROGRESS") ||
    (oldEvaluationSheet.status === "IN_PROGRESS" &&
      evaluationSheet.status !== "IN_PROGRESS")
  ) {
    // Ambil semua pengguna dengan status ACTIVE
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

    // Email HTML template
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
    <p style="color: #4a5568;">Jika Anda tidak mengharapkan perubahan ini, harap segera menghubungi admin.</p>
    <div style="margin-top: 24px;">
      <a href="${waLink}" style="display: inline-block; background-color: #25D366; color: white; font-weight: bold; padding: 12px 16px; border-radius: 4px; text-decoration: none; transition: background-color 0.2s;">Hubungi Admin via WhatsApp</a>
    </div>
  `;
    } else {
      statusMessage += `
      <p style="color: #4a5568;">Jika Anda tidak mengharapkan perubahan ini, harap segera menghubungi admin.</p>
    <div style="margin-top: 24px;">
      <a href="${waLink}" style="display: inline-block; background-color: #25D366; color: white; font-weight: bold; padding: 12px 16px; border-radius: 4px; text-decoration: none; transition: background-color 0.2s;">Hubungi Admin via WhatsApp</a>
    </div>`;
    }

    const emailMessage = `
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); padding: 24px;">
    <h1 style="font-size: 24px; font-weight: bold; color: #2d3748; margin-bottom: 16px;">Pemberitahuan Perubahan Status</h1>
    <p style="color: #4a5568; margin-bottom: 8px;">Status LKE berjudul <strong>${evaluationSheet.title}</strong> telah berubah.</p>
    ${statusMessage}
  </div>
`;

    // Kirim email ke setiap pengguna aktif
    for (const user of activeUsers) {
      await sendMail({
        to: user.email,
        subject: `Status Update for LKE: ${evaluationSheet.title}`,
        html: emailMessage,
      });
    }
  }

  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json(
      { message: "User not authenticated" },
      { status: 401 }
    );
  }
  const activityLog = createActivityLog(
    `LKE berjudul ${evaluationSheet.title} diupdate`,
    "Evaluations",
    0,
    Number(session.user.id)
  );

  return NextResponse.json({ evaluationSheet, activityLog }, { status: 201 });
};
