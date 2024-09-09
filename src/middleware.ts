import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req });
    console.log("Token:", token);

    const { pathname } = req.nextUrl;

    if (pathname === "/login" && token) {
        return NextResponse.redirect(new URL("/", req.url));
    }
    if (pathname === "/login" && !token) {
        return NextResponse.next();
    }
    if (!token && pathname !== "/login") {
        const loginUrl = new URL("/login", req.url);
        return NextResponse.redirect(loginUrl);
    }

    if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
        const homeUrl = new URL("/", req.url);
        return NextResponse.redirect(homeUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/login",
        "/admin/:path*",
        "/hasil-sementara",
        "/panduan",
        "/riwayat",
        "/",
    ],
};
