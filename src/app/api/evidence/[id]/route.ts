import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { supabase } from "@/lib/supabaseClient";
import { createActivityLog } from "@/lib/activityLog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
const prisma = new PrismaClient();

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number.parseInt(params.id, 10);
  // Validasi ID
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  try {
    // Ambil data evidence dari database berdasarkan ID
    const evidence = await prisma.evidence.findUnique({
      where: { id },
    });

    if (!evidence) {
      return NextResponse.json(
        { error: "File tidak ditemukan" },
        { status: 404 }
      );
    }

    // Hapus file dari Supabase storage
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, error: supabaseError } = await supabase.storage
      .from("evidence")
      .remove([evidence.file_path]);

    if (supabaseError) {
      console.error(supabaseError);
      return NextResponse.json(
        { error: "Gagal menghapus file di Supabase" },
        { status: 500 }
      );
    }

    // Hapus data dari database
    await prisma.evidence.delete({
      where: { id },
    });

    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );
    }
    await createActivityLog(
      "Evidence dihapus",
      "Evidence",
      evidence.id,
      Number(session.user.id)
    );

    return NextResponse.json(
      { message: "File berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menghapus file" },
      { status: 500 }
    );
  }
}
