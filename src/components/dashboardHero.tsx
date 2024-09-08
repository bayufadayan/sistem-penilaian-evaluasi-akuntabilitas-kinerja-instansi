import React from "react";
import Image from "next/image";

export default function DashboardHero() {
  return (
    <div className="hero-image">
      <div className="hero-container">
        <div className="hero-title">
          <h1>Dashborad Evaluasi Akuntabilitas Kinerja</h1>
          <p>
            Selamat datang di EkaPrime! Sistem manajemen kinerja yang
            terintegrasi. Pantau dan evaluasi progress ASN dengan mudah dan
            efisien.
          </p>
        </div>

        <div className="hero-pictures">
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
