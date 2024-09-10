'use client'
import React from "react";
import Image from "next/image";
import styles from "@/styles/styles.module.css";
import { useEffect, useState } from "react";
import SidebarUser from "@/components/sidebarUser";

interface Component {
  id: number;
  name: string;
  description: string;
  weight: number;
  subComponents: SubComponent[];
}

interface SubComponent {
  id: number;
  name: string;
  description: string;
  weight: number;
}

interface EvaluationSheet {
  id: string;
  title: string;
  description: string;
  components: Component[];
}

export default function EvaluationSheetsPage({ params }: { params: { id: string } }) {
  const [evaluation, setEvaluation] = useState<EvaluationSheet | null>(null);
  const id = params.id;

  useEffect(() => {
    const fetchEvaluationSheet = async () => {
      if (id) {
        const res = await fetch(`/api/evaluations/${id}`);
        const data = await res.json();
        setEvaluation(data);
      }
    };
    fetchEvaluationSheet();
  }, [id]);

  if (!evaluation) {
    return <p>Loading...</p>;
  }

  return (
    <main className={`${styles.mainContainer} ${styles.lkeFilling}`}>
      <SidebarUser components={evaluation.components} evaluationTitle={evaluation.title}/>
      <div className={styles.lkeContentContainer}>
        <div className={styles.lkeContent}>
          <div className={styles.lkeContentHeader}>
            <div className={styles.breadcrumb}>Lembar Kerja Evaluasi</div>

            <h1 className="leading-tight mb-4">{evaluation.title}</h1>
            <p className="text-sm">
              Tentukan nilai untuk setiap kriteria sesuai dengan performa yang
              telah dicapai
            </p>
          </div>

          <div className={styles.fillguideMain}>
            <div className={styles.staticticAnswer}>
              <p>Statistik pengisi</p>
              <Image
                src="/images/statistic-answer.png"
                alt="statistic"
                width={929}
                height={262}
              />
            </div>

            <div className={styles.explainComponents}>
              <h5 className="font-bold">Deskripsi</h5>
              <p>{evaluation.description}</p>
            </div>
          </div>

          <div className={styles.nextButton}>
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
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
