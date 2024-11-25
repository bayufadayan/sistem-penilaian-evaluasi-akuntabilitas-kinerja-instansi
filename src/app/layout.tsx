"use client";
import { SessionProvider } from "next-auth/react";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <NextTopLoader showSpinner={false} />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
