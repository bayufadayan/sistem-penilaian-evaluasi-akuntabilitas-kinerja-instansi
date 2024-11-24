"use client";
import { SessionProvider } from "next-auth/react";
import NextTopLoader from "nextjs-toploader";
import { Epilogue } from "next/font/google";
import "./globals.css";

const epilogue = Epilogue({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={epilogue.className}>
        <SessionProvider>
          <NextTopLoader showSpinner={false} />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
