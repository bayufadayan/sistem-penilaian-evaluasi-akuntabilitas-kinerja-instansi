import React from "react";
import Image from "next/image";
import styles from "@/styles/styles.module.css"

export default function DashboardHero() {
  return (
    <div className={styles.heroImage}>
      <div className={styles.heroContainer}>
        <div className={styles.heroTitle}>
          <h1>Dashborad Evaluasi Akuntabilitas Kinerja</h1>
          <p>
            Selamat datang di EkaPrime! Sistem manajemen kinerja yang
            terintegrasi. Pantau dan evaluasi progress ASN dengan mudah dan
            efisien.
          </p>
        </div>

        <div className={styles.heroPictures}>
          <Image
            src="/images/illustration2.png"
            alt="Ilustrastion-Pic"
            width={308}
            height={308}
          />
        </div>
      </div>
    </div>
  );
}
