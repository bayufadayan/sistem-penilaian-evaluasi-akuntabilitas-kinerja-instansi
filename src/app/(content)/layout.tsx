// import type { Metadata } from "next";
"use client";
import "../globals.css";
import styles from "@/styles/styles.module.css"
import { Inter } from "next/font/google";
import Navbar from "@/components/navbarReg";
import Footer from "@/components/footer";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <SessionProvider>
          <header className={styles.mainHeader}>
            <Navbar />
          </header>

          <div>
          {children}
          </div>

          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
