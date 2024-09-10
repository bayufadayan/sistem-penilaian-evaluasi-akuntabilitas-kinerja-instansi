"use client";
import React, { useEffect, useState } from "react";
import styles from "@/styles/styles.module.css";
import { IoIosArrowForward } from "react-icons/io";
import { useDataContext } from "../layout";
import Link from "next/link";

enum ScoreExplainSectionType {
  Keberadaan = "Keberadaan",
  Kualitas = "Kualitas",
  Pemanfaat = "Pemanfaat",
}

interface ScoreExplain {
  id: number;
  section: ScoreExplainSectionType;
  pilihan: string;
  nilai: number;
  penjelasan: string;
}

export default function InstructionPage() {
  const [scoreExplain, setScoreExplain] = useState<ScoreExplain[]>([]);
  const [activeSection, setActiveSection] = useState<ScoreExplainSectionType>(
    ScoreExplainSectionType.Keberadaan
  );
  const dataContext = useDataContext();

  useEffect(() => {
    const fetchScoreExplain = async () => {
      try {
        const res = await fetch("/api/scoreexplain");
        const data = await res.json();
        setScoreExplain(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchScoreExplain();
  }, []);

  const filteredSections = scoreExplain.filter(
    (item) => item.section === activeSection
  );

  return (
    <div className={styles.lkeContentContainer}>
      <div className={styles.lkeContent}>
        <div className={styles.lkeContentHeader}>
          <div className={`${styles.breadcrumb}`}>
            <Link href={`/sheets/${dataContext?.evaluationId}`} className="text-blue-800 opacity-100">
              Lembar Kerja Evaluasi
            </Link>{" "}
            / Penjelasan Penilaian
          </div>

          <h1 className="leading-snug">
            Penjelasan Penilaian dalam Pengisian Lembar Kerja Evaluasi AKIP
          </h1>
          <p>
            Pengisian jawaban dilakukan pada sub-komponen, setiap sub-komponen
            dinilai berdasarkan pemenuhan kualitas dari kriteria (sebagai
            probing), dengan pilihan jawaban AA/A/BB/B/CC/C/D/E sesuai dengan
            gradasi nilai, sebagai berikut:
          </p>
        </div>

        <div className={styles.scroringGuideContainer}>
          <div className={styles.explainMenuSection}>
            <div className={styles.explainMainMenu}>
              <h5 className="font-semibold">Penjelasan</h5>
              <div className={styles.menuContainer}>
                <button
                  type="button"
                  className={`${
                    activeSection === ScoreExplainSectionType.Keberadaan
                      ? "bg-blue-800 text-white"
                      : "text-blue-800"
                  } ${styles.theMenu} hover:bg-blue-800 hover:text-white`}
                  onClick={() =>
                    setActiveSection(ScoreExplainSectionType.Keberadaan)
                  }
                >
                  <p>Keberadaan</p>
                  <IoIosArrowForward className="text-xl" />
                </button>

                <button
                  type="button"
                  className={`${
                    activeSection === ScoreExplainSectionType.Kualitas
                      ? "bg-blue-800 text-white"
                      : "text-blue-800"
                  } ${styles.theMenu} hover:bg-blue-800 hover:text-white`}
                  onClick={() =>
                    setActiveSection(ScoreExplainSectionType.Kualitas)
                  }
                >
                  <p>Kualitas</p>
                  <IoIosArrowForward className="text-xl" />
                </button>

                <button
                  type="button"
                  className={`${
                    activeSection === ScoreExplainSectionType.Pemanfaat
                      ? "bg-blue-800 text-white"
                      : "text-blue-800"
                  } ${styles.theMenu} hover:bg-blue-800 hover:text-white`}
                  onClick={() =>
                    setActiveSection(ScoreExplainSectionType.Pemanfaat)
                  }
                >
                  <p>Pemanfaatan</p>
                  <IoIosArrowForward className="text-xl" />
                </button>
              </div>
            </div>

            <div className={`${styles.nextButton} ${styles.nextScoreExplain}`}>
              <button type="button">
                <p>Selanjutnya</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="45"
                  height="45"
                  viewBox="0 0 45 45"
                  fill="none"
                >
                  <title>Next</title>
                  <rect width="45" height="45" rx="22.5" fill="#01499F" />
                  <path
                    d="M19 30L26.5 22.5L19 15"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className={styles.explainTableSection}>
            <h4 className="font-bold mb-2 text-center text-white text-xl bg-blue-800 p-4 rounded">
              {`< ${activeSection} >`}
            </h4>
            <table>
              <thead>
                <tr>
                  <td>#</td>
                  <td>Pilihan</td>
                  <td>Nilai</td>
                  <td>Penjelasan</td>
                </tr>
              </thead>
              {filteredSections.length > 0 ? (
                <tbody>
                  {filteredSections
                    .sort((a, b) => a.id - b.id)
                    .map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{item.pilihan}</td>
                        <td>{item.nilai}</td>
                        <td>{item.penjelasan}</td>
                      </tr>
                    ))}
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td colSpan={4} className="mt-2">
                      Tidak ada data tersedia
                    </td>
                  </tr>
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
