"use client";
import { useEffect, useState, createContext, useContext } from "react";
import AdminNavbar from "./components/adminNavbar";
import AdminSidebar from "./components/adminSidebar";
import { Epilogue } from "next/font/google";
import { Helmet } from "react-helmet";

const epilogue = Epilogue({ subsets: ["latin"] });

const DataContext = createContext<{
  appNameContext: string;
} | null>(null);

export const useDataContext = () => useContext(DataContext);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setisLoading] = useState(false);
  const [appName, setAppName] = useState<string>("Eka Prime");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setisLoading(true);
        const response = await fetch("/api/settings");
        const data = await response.json();
        setisLoading(false);
        setAppName(data.appName);
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    };

    fetchSettings();
  }, []);

  const appNameContext = appName;

  return (
    <html lang="en">
      <Helmet>
        <title>
          {isLoading ? "Loading..." : `Dahboard Admin | ${appName}`}
        </title>
      </Helmet>
      <body className={epilogue.className}>
        <DataContext.Provider
          value={{ appNameContext }}
        >
          <AdminNavbar />
          <AdminSidebar />

          <div className="p-8 ml-64 mt-14">{children}</div>
        </DataContext.Provider>
      </body>
    </html>
  );
}
