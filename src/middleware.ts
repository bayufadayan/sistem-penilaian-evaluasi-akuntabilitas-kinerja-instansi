import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  console.log("Middleware Token:", token);

  const { pathname, searchParams } = req.nextUrl;

  // 1. Jika akses ke `/login`:
  if (pathname === "/login") {
    if (token) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // 2. Jika akses ke `/reset-password`:
  if (pathname === "/reset-password") {
    const urlToken = searchParams.get("token");
    console.log("URL Token:", urlToken);

    if (!urlToken) {
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // 3. Untuk semua rute lain selain `/login` dan `/reset-password`:
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Jika akses ke /admin dan role bukan ADMIN:
  if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
    const homeUrl = new URL("/", req.url);
    return NextResponse.redirect(homeUrl);
  }

  // 5. Jika semua syarat terpenuhi, lanjutkan request
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/reset-password",
    "/admin/:path*",
    "/hasil-sementara",
    "/panduan",
    "/riwayat",
    "/profile",
    "/sheets/:path*",
    "/",
  ],
};
