"use client";
import { SessionProvider } from "next-auth/react";
import AdminNavbar from "../components/adminNavbar";
import AdminSidebar from "../components/adminSidebar";
import "../../globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <AdminNavbar />
      <AdminSidebar />

      <div className="p-8 ml-64 mt-14">{children}</div>
    </SessionProvider>
  );
}
