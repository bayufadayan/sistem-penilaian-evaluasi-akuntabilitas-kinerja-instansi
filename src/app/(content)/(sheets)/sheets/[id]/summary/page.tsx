"use client";
import React, { useEffect, useState, useCallback } from "react";
import styles from "@/styles/styles.module.css";
import axios from "axios";
import { useDataContext } from "../layout";

type ComponentData = {
  id: number;
  name: string;
  weight: number;
  componentScore: { nilai: number }[];
};

export default function SummaryScore() {
  const { evaluationId } = useDataContext() || {};
  const [components, setComponents] = useState<ComponentData[]>([]);
  const [totalScore, setTotalScore] = useState<number>(0);

  const saveTotalScore = useCallback(
    async (total: number) => {
      try {
        const grade =
          total >= 90 ? "AA" : total >= 75 ? "BB" : total >= 60 ? "B" : "C";

        // Kirim total score dan grade ke API evaluationscore
        await axios.patch(
          `/api/calculateScore/evaluationscore/${evaluationId}`,
          {
            nilai: total,
            grade: grade,
          }
        );

        console.log("Total score berhasil disimpan:", total);
      } catch (error) {
        console.error("Error saving total score:", error);
      }
    },
    [evaluationId]
  );

  useEffect(() => {
    if (!evaluationId) return;

    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/evaluations/${evaluationId}`);
        const { components } = response.data;

        // Hitung total nilai dari semua komponen
        const total = components.reduce(
          (acc: number, component: ComponentData) => {
            const componentTotal = component.componentScore?.[0]?.nilai ?? 0;
            return acc + componentTotal;
          },
          0
        );

        setComponents(components);
        setTotalScore(total);

        // Simpan total score ke database
        saveTotalScore(total);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [evaluationId, saveTotalScore]);

  return (
    <div className={`${styles.lkeContentContainer} h-screen`}>
      <div className={`${styles.lkeContent}`}>
        <div className={styles.fillCriteriaHeader}>
          <div className={styles.breadcrumb}>
            Lembar Kinerja Evaluasi / Perencanaan Kinerja / Dokumen Perencanaan
            Kinerja...
          </div>

          <div className={styles.fillCriteriaHeroContainer}>
            <div className={styles.fillCriteriaHeaderContent}>
              <div className={styles.criteriaTitleContainer}>
                <div className={styles.mainTitle}>
                  <h1 className="text-3xl">Hasil Pengisian AKIP</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-t-2 border-gray-300 my-2" />

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  No
                </th>
                <th scope="col" className="px-6 py-3">
                  Komponen/Sub Komponen/Kriteria
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  Bobot
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  Nilai
                </th>
              </tr>
            </thead>
            <tbody>
              {components.map((component, index) => (
                <tr
                  className="bg-white border-b hover:bg-gray-50"
                  key={component.id}
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4">{component.name}</td>
                  <td className="px-6 py-4 text-right">
                    {component.weight.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {component.componentScore?.[0]?.nilai?.toFixed(2) ?? "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-bold bg-gray-100">
                <td
                  colSpan={2}
                  className="px-6 py-3 text-right border-t border-gray-300"
                >
                  Nilai Akuntabilitas Kinerja
                </td>
                <td className="px-6 py-3 text-right border-t border-gray-300">
                  {totalScore.toFixed(2)}
                </td>
                <td className="px-6 py-3 text-center border-t border-gray-300">
                  {/* Grade can be calculated based on totalScore */}
                  {totalScore >= 90
                    ? "AA"
                    : totalScore >= 75
                    ? "BB"
                    : totalScore >= 60
                    ? "B"
                    : "C"}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
