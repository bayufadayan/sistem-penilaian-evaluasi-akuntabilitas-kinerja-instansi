import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/sendMail";

export const GET = async (request: Request) => {
  try {
    // Verify request is from authorized source (could add API key check here)
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(now.getDate() + 3);

    // Find evaluations that are:
    // 1. Not completed
    // 2. Have deadline within 3 days
    const upcomingEvaluations = await prisma.evaluationSheet.findMany({
      where: {
        status: {
          in: ["PENDING", "IN_PROGRESS"],
        },
        date_finish: {
          gte: now,
          lte: threeDaysFromNow,
        },
      },
      include: {
        components: {
          include: {
            team: {
              include: {
                users: {
                  where: {
                    status: "ACTIVE",
                  },
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
            subComponents: {
              include: {
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

    const emailsSent: string[] = [];
    const errors: string[] = [];

    for (const evaluation of upcomingEvaluations) {
      for (const component of evaluation.components) {
        // Calculate completion percentage
        const totalCriteria = component.subComponents.reduce(
          (sum, sub) => sum + sub.criteria.length,
          0
        );
        const filledCriteria = component.subComponents.reduce(
          (sum, sub) =>
            sum +
            sub.criteria.filter((crit) => crit.score[0]?.score !== "").length,
          0
        );
        const completionPercentage =
          totalCriteria > 0 ? (filledCriteria / totalCriteria) * 100 : 0;

        // Only send reminder if not 100% complete
        if (completionPercentage < 100) {
          const daysLeft = Math.ceil(
            (new Date(evaluation.date_finish).getTime() - now.getTime()) /
              (1000 * 60 * 60 * 24)
          );

          // Send email to all team members
          for (const user of component.team.users) {
            try {
              const emailContent = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #2c3e50;">Pengingat Deadline Evaluasi AKIP</h2>
                  
                  <p>Halo <strong>${user.name}</strong>,</p>
                  
                  <p>Ini adalah pengingat bahwa evaluasi berikut akan segera berakhir:</p>
                  
                  <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #3498db; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #2c3e50;">${evaluation.title}</h3>
                    <p style="margin: 5px 0;"><strong>Tahun:</strong> ${evaluation.year}</p>
                    <p style="margin: 5px 0;"><strong>Deadline:</strong> ${new Date(evaluation.date_finish).toLocaleDateString("id-ID")}</p>
                    <p style="margin: 5px 0;"><strong>Sisa Waktu:</strong> <span style="color: ${daysLeft <= 1 ? "#e74c3c" : "#f39c12"}; font-weight: bold;">${daysLeft} hari</span></p>
                  </div>
                  
                  <div style="background-color: ${completionPercentage < 50 ? "#fee" : "#fef8e7"}; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p style="margin: 0;"><strong>Status Pengisian Tim ${component.team.name}:</strong></p>
                    <p style="margin: 5px 0;">Komponen: ${component.name}</p>
                    <p style="margin: 5px 0;">Progress: ${completionPercentage.toFixed(1)}% (${filledCriteria}/${totalCriteria} kriteria)</p>
                  </div>
                  
                  ${completionPercentage < 100 ? `
                    <p style="color: #e74c3c; font-weight: bold;">⚠️ Mohon segera lengkapi evaluasi sebelum deadline!</p>
                  ` : ""}
                  
                  <p>Silakan login ke sistem untuk melengkapi evaluasi Anda:</p>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.NEXTAUTH_URL}/sheets/${evaluation.id}" 
                       style="background-color: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                      Buka Evaluasi
                    </a>
                  </div>
                  
                  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                  
                  <p style="font-size: 12px; color: #7f8c8d;">
                    Email ini dikirim secara otomatis oleh Sistem Evaluasi AKIP.<br>
                    Jika Anda memiliki pertanyaan, silakan hubungi administrator.
                  </p>
                </div>
              `;

              await sendMail(
                user.email,
                `Pengingat: Deadline Evaluasi "${evaluation.title}" - ${daysLeft} Hari Lagi`,
                emailContent
              );

              emailsSent.push(user.email);
            } catch (error) {
              console.error(`Failed to send email to ${user.email}:`, error);
              errors.push(`${user.email}: ${error}`);
            }
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Email notifications sent",
      data: {
        evaluationsChecked: upcomingEvaluations.length,
        emailsSent: emailsSent.length,
        uniqueRecipients: Array.from(new Set(emailsSent)).length,
        errors: errors.length,
        errorDetails: errors,
      },
    });
  } catch (error) {
    console.error("Error in deadline notification cron:", error);
    return NextResponse.json(
      { message: "Failed to process deadline notifications", error },
      { status: 500 }
    );
  }
};

// Manual trigger endpoint (for testing)
export const POST = async (request: Request) => {
  // Same logic as GET, but allow manual triggering by admin
  const body = await request.json();
  
  if (body.manualTrigger !== true) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  // Re-use GET logic
  return GET(request);
};
