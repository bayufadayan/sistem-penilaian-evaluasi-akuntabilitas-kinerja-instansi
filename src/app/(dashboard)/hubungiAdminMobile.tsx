"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoLogoWhatsapp } from "react-icons/io";

export default function ContactAdminMobile() {
    const [adminPhone, setAdminPhone] = useState("");
    const [appName, setAppName] = useState("");

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/settings");
                const data = await res.json();
                setAdminPhone(data.adminPhone || "");
                setAppName(data.appName || "Aplikasi");
            } catch (error) {
                console.error("Failed to fetch settings:", error);
            }
        };

        fetchSettings();
    }, []);

    const message = `Hai, Admin ${appName},%0A%0ASaya [Tulis nama anda], dari bagian [sektor anda bekerja] ingin menanyakan tentang penggunaan aplikasi ${appName}`;

    const waLink = `https://wa.me/62${adminPhone}?text=${message}`;

    return (
        <Link href={waLink} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center space-y-2 group">
            <div className="p-4 bg-blue-100 rounded-full transition-transform group-hover:scale-110">
                <IoLogoWhatsapp className="fill-blue-600 w-6 h-6" />
            </div>
            <small className="text-gray-600 group-hover:text-blue-800 font-medium">Kontak</small>
        </Link>
    );
}
