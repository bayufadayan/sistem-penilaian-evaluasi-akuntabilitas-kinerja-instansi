import { NextResponse } from "next/server";
import type { User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/utils";
import { createActivityLog } from "@/lib/activityLog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";

export const POST = async (request: Request) => {
  const body: User = await request.json();

  // Cek apakah user dengan email yang sama sudah ada
  const existingUser = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });

  if (existingUser) {
    return NextResponse.json(
      { message: "Email sudah terdaftar, silakan daftarkan dengan email lain" },
      { status: 400 }
    );
  }

  // Hash password pengguna baru
  const hashedPassword = await hashPassword(body.password);

  // Pastikan id_team valid, tidak boleh 0
  const teamExists = await prisma.team.findUnique({
    where: { id: body.id_team },
  });

  if (!teamExists && body.id_team !== 0) {
    return NextResponse.json(
      { message: "Team dengan ID tersebut tidak ditemukan" },
      { status: 400 }
    );
  }

  // Membuat user baru
  const user = await prisma.user.create({
    data: {
      email: body.email,
      password: hashedPassword,
      nip: BigInt(body.nip),
      name: body.name,
      role: body.role,
      gender: body.gender,
      status: body.status,
      id_team: body.id_team || 1, // default ke team dengan id 1 jika id_team 0 atau tidak valid
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
    "Akun Baru dibuat",
    "User",
    user.id,
    Number(session.user.id)
  );

  const responseUser = {
    ...user,
    nip: user.nip.toString(),
  };

  return NextResponse.json({ responseUser, activityLog }, { status: 201 });
};
export const GET = async () => {
  try {
    const users = await prisma.user.findMany(); // Mengambil semua pengguna

    if (!users || users.length === 0) {
      return NextResponse.json({ message: "No users found" }, { status: 404 });
    }

    // Menyusun data pengguna agar sesuai dengan format yang diinginkan
    const serializedUsers = users.map((user) => ({
      ...user,
      id: user.id.toString(),
      nip: user.nip ? user.nip.toString() : null,
    }));

    // Mengembalikan respons JSON
    return NextResponse.json(serializedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
};
