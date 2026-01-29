import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import sendMail from "@/lib/sendMail";

export const POST = async (request: Request) => {
  try {
    const { email } = await request.json();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpire,
      },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;
    const message = `
  <p>Anda menerima email ini karena telah melakukan permintaan untuk mereset password Anda. Jika Anda tidak merasa melakukan permintaan ini, silakan abaikan email ini.</p>
  
  <p>Untuk melanjutkan proses reset password, silakan klik tombol di bawah ini (Kadaluarsa dalam 1 jam):</p>
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto;">
    <tr>
      <td align="center" style="padding: 20px;">
        <a href="${resetUrl}" style="background-color: #007BFF; color: #ffffff; padding: 15px 25px; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
      </td>
    </tr>
  </table>
  
  <p>Atau Anda bisa menggunakan link berikut untuk melanjutkan proses reset password:</p>
  <p><a href="${resetUrl}" style="color: #007BFF; text-decoration: none;">${resetUrl}</a></p>
  <p>Jika Anda tidak meminta untuk mereset password, Anda bisa mengabaikan email ini.</p>

  <p>Terima kasih,</p>
  <p><strong>Tim Pengembang Aplikasi</strong></p>
`;

    // Kirim email
    await sendMail(
      email,
      "Reset Password",
      message
    );

    return NextResponse.json(
      { message: "Password reset email sent." },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
};
