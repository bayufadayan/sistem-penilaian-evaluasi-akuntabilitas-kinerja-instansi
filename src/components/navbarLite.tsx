"use client"
import Image from "next/image";
import styles from "@/styles/login.module.css"
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NavbarLite() {
  const [isLogoLoading, setisLogoLoading] = useState(false);
  const [settings, setSettings] = useState({
    appName: "",
    appLogoLogin: "",
    appLogoDashboard: "",
    appLogoFooter: "",
    favicon: "",
    adminEmail: "",
    adminMailPass: "",
    adminPhone: "",
    guideLink: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setisLogoLoading(true);
        const response = await fetch("/api/settings");
        const data = await response.json();
        setSettings(data);
        setisLogoLoading(false);
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    };

    fetchSettings();
  }, []);

  return (
    <header className={styles.loginHeader}>
      <nav className={styles.loginNav}>
        <Link href={"/login"}>
          {isLogoLoading
            ? ("Loading...")
            : (<Image src={settings.appLogoLogin ? settings.appLogoLogin : "/images/navbar-flat.svg"} alt="logo instansi" width={200} height={34} />)
          }
        </Link>
      </nav>
    </header>
  );
}
