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
        <SessionProvider data-testid="session-provider">
          <NextTopLoader showSpinner={false} data-testid="next-top-loader" />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
