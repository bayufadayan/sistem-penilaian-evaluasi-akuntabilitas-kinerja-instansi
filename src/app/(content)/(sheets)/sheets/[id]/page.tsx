"use client";
import React from "react";
import Image from "next/image";
import styles from "@/styles/styles.module.css";
import { useDataContext } from "./layout";
import Link from "next/link";

export default function EvaluationSheetsPage() {
  const dataContext = useDataContext();

  if (!dataContext) return <div>No Data Found</div>;

  return (
    <div className={styles.lkeContentContainer}>
      <div className={styles.lkeContent}>
        <div className={styles.lkeContentHeader}>
          <div className={styles.breadcrumb}>Lembar Kerja Evaluasi</div>

          <h1 className="leading-tight mb-4">{dataContext.evaluationName}</h1>
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
            <p>{dataContext.evaluationDesc}</p>
          </div>
        </div>

        <Link href={`${dataContext.evaluationId}/instruction`}>
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
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
}
