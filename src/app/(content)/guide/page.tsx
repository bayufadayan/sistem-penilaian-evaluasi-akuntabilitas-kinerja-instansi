"use client";

import React, { useEffect, useState } from "react";
import styles from "@/styles/styles.module.css";

export default function PanduanPage() {
  const [guideLink, setGuideLink] = useState<string | null>(null);
  const [appName, setAppName] = useState<string | null>(null);

  // Fetch guide link from API
  useEffect(() => {
    const fetchGuideLink = async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();

        // Ambil URL asli
        const originalLink = data.guideLink || null;

        // Ubah URL jika perlu (dari /view menjadi /preview)
        const embedLink = originalLink?.includes("/view")
          ? originalLink.replace("/view", "/preview")
          : originalLink;
        setAppName(data.appName);
        setGuideLink(embedLink || null);
      } catch (error) {
        console.error("Failed to fetch guide link:", error);
      }
    };

    fetchGuideLink();
  }, []);


  return (
    <main className={styles.mainContainer}>
      <div className={`mt-10 md:min-h-[76vh] ${guideLink ? "min-h-[73vh]" : "h-screen w-3/4"}`}>
        <h1 className="font-bold text-3xl pt-10 mb-5 text-black text-center md:text-left">Panduan Penggunaan Aplikasi</h1>
        <div className="mb-5 text-black">
          <strong>Deskripsi: </strong>
          <br />
          Berikut panduan yang bisa anda baca untuk memakai Aplikasi {appName}
        </div>
        <div className="w-full">
          {guideLink ? (
            <div className="mb-5 md:mb-0">
              <iframe
                src={guideLink}
                width="100%"
                className="border-2 border-gray-300 rounded-md shadow-sm w-full md:w-3/4 h-[550px] md:h-[1000px]"
                allow="autoplay"
                allowFullScreen
                title="Panduan Penggunaan Aplikasi"
              />

              <a
                href={guideLink}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-block mt-3 text-blue-600 underline hover:text-blue-800 text-center w-full md:w-fit font-bold"
              >
                Unduh Panduan
              </a>
            </div>



          ) : (
            <p className="text-red-600 w-full">
              Panduan belum tersedia. Silakan cek kembali nanti.
            </p>
          )}
        </div>

      </div>
    </main>
  );
}
