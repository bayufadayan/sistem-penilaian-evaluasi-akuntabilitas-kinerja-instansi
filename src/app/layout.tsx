"use client";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { Epilogue } from "next/font/google";

const epilogue = Epilogue({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={epilogue.className}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
