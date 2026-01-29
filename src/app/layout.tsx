"use client";
import { SessionProvider } from "next-auth/react";
import NextTopLoader from "nextjs-toploader";
import { SWRConfig } from "swr";
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
          <SWRConfig
            value={{
              refreshInterval: 0,
              revalidateOnFocus: false,
              revalidateOnReconnect: true,
              dedupingInterval: 5000,
              errorRetryCount: 2,
            }}
          >
            <NextTopLoader showSpinner={false} data-testid="next-top-loader" />
            {children}
          </SWRConfig>
        </SessionProvider>
      </body>
    </html>
  );
}
