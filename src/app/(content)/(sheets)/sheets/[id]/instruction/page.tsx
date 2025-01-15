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

interface SubComponent {
  id: number;
  name: string;
  description: string;
  weight: number;
  subcomponent_number: number;
  id_components: number;
}

interface Component {
  id: number;
  name: string;
  description: string;
  weight: number;
  component_number: number;
  id_team: number;
  id_LKE: string;
  subComponents: SubComponent[];
}

export default function InstructionPage() {
  const [scoreExplain, setScoreExplain] = useState<ScoreExplain[]>([]);
  const [firstSubComponents, setFirstSubComponents] = useState<SubComponent | null>(null);
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

    const fetchComponents = async () => {
      try {
        const res = await fetch(`/api/components-by-lke/${dataContext?.evaluationId}`);
        const data: { component: Component } = await res.json();

        // Cari subcomponent dengan subcomponent_number terkecil
        const smallestSubComponent = data.component.subComponents.reduce((smallest, current) =>
          current.subcomponent_number < smallest.subcomponent_number ? current : smallest
        );

        setFirstSubComponents(smallestSubComponent);

      } catch (error) {
        console.error("Error fetching components:", error);
      }
    };


    fetchScoreExplain();
    fetchComponents();
  }, [dataContext?.evaluationId]);

  const filteredSections = scoreExplain.filter(
    (item) => item.section === activeSection
  );

  if (!dataContext) return <div>No Data Found</div>;

  return (
    <div className={styles.lkeContentContainer}>
      <div className={styles.lkeContent}>
        <div className={styles.lkeContentHeader}>
          <div className={`${styles.breadcrumb}`}>
            <Link href={`/`} className="text-blue-700 font-semibold hover:text-green-600">
              Beranda
            </Link>{" "}
            <span>{" / "}</span>
            <Link href={`/sheets/${dataContext?.evaluationId}`} className="text-blue-600 hover:text-green-600 font-semibold">
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
                  className={`${activeSection === ScoreExplainSectionType.Keberadaan
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
                  className={`${activeSection === ScoreExplainSectionType.Kualitas
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
                  className={`${activeSection === ScoreExplainSectionType.Pemanfaat
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

            <div className={`${styles.nextButton}`}>
              <Link href={`/sheets/${dataContext.evaluationId}/${firstSubComponents?.id}`} className="text-blue-500 rounded-lg px-4 hover:bg-blue-500 hover:text-white transition-colors duration-300 ease-in-out shadow-md bg-white">
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
              </Link>
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
                      Loading ...
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
