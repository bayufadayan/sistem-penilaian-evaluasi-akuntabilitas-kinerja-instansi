"use client";
import React, { useEffect, useState, useCallback } from "react";
import styles from "@/styles/styles.module.css";
import axios from "axios";
import { useDataContext } from "../layout";
import { FaChartLine, FaStar } from "react-icons/fa";
import ComponentChart from "./chartComponent";

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
    <div className={`${styles.lkeContentContainer} min-h-screen`}>
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

        <div className="grid grid-cols-4 gap-6 mb-4">
          {/* Card Detail Informasi */}
          <div className="col-span-2 p-5 bg-white rounded-lg shadow-lg border-l-4 border-blue-600">
            <div>
              <h2 className="text-md font-bold text-blue-600 mb-2">
                Detail Informasi
              </h2>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-600">
                    Komponen
                  </p>
                  <p className="text-xl font-bold text-blue-600">
                    {components.length}
                  </p>
                </div>
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-600">
                    Sub Komponen
                  </p>
                  <p className="text-xl font-bold text-blue-600">23</p>
                </div>
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-600">
                    Kriteria
                  </p>
                  <p className="text-xl font-bold text-blue-600">54</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 - Nilai LKE */}
          <div className="p-5 bg-white rounded-lg shadow-lg flex items-center justify-between border-l-4 border-green-600">
            <div>
              <h2 className="text-md font-bold text-green-600 mb-2">
                Nilai LKE
              </h2>
              <p className="text-3xl font-bold text-green-600">{totalScore.toFixed(2)}</p>
            </div>
            <FaChartLine className="w-12 h-12 text-green-100" />
          </div>

          {/* Card 3 - Grade LKE */}
          <div className="p-5 bg-white rounded-lg shadow-lg flex items-center justify-between border-l-4 border-yellow-500">
            <div>
              <h2 className="text-md font-bold text-yellow-500 mb-2">
                Grade LKE
              </h2>
              <p className="text-3xl font-bold text-yellow-500">
                {totalScore >= 90
                  ? "AA"
                  : totalScore >= 75
                  ? "BB"
                  : totalScore >= 60
                  ? "B"
                  : "C"}
              </p>
            </div>
            <FaStar className="w-12 h-12 text-yellow-100" />
          </div>
        </div>

        <div className="rounded bg-blue-600 text-white font-bold text-lg text-center py-4">
          <span>Nilai Akhir LKE AKIP</span>
        </div>

        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 table-fixed">
            <thead className="text-md text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="w-16 px-4 py-3 text-left">
                  No
                </th>
                <th scope="col" className="w-1/2 px-4 py-3 text-left">
                  Nama Komponen
                </th>
                <th scope="col" className="w-1/5 px-4 py-3 text-center">
                  Bobot
                </th>
                <th scope="col" className="w-1/5 px-4 py-3 text-center">
                  Nilai
                </th>
              </tr>
            </thead>
            <tbody>
              {components.map((component, index) => (
                <tr
                  className={`bg-white border-b hover:bg-gray-100 ${
                    index % 2 === 0 ? "bg-gray-50" : ""
                  }`}
                  key={component.id}
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-left">{component.name}</td>
                  <td className="px-6 py-4 text-center">
                    {component.weight.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {component.componentScore?.[0]?.nilai?.toFixed(2) ?? "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-bold bg-blue-50 text-blue-700">
                <td
                  colSpan={2}
                  className="px-6 py-2 text-left border-t border-gray-300 text-lg"
                >
                  Nilai Akuntabilitas Kinerja
                </td>
                <td
                  className="px-6 py-2 border-t border-gray-300 text-lg font-bold"
                  colSpan={2}
                >
                  <div className="p-2 bg-blue-700 text-white rounded w-fit ml-auto mr-5">
                    {totalScore.toFixed(2)}
                  </div>
                </td>
              </tr>
              <tr className="font-bold bg-yellow-50 text-yellow-600">
                <td
                  colSpan={2}
                  className="px-6 py-2 border-t border-gray-300 text-lg font-bold"
                >
                  Grade Akuntabilitas Kinerja
                </td>
                <td
                  className="px-6 py-2 text-right border-t border-gray-300 text-lg font-bold"
                  colSpan={2}
                >
                  <div className="py-2 px-4 bg-yellow-600 text-white rounded w-fit ml-auto mr-5">
                    {totalScore >= 90
                      ? "AA"
                      : totalScore >= 75
                      ? "BB"
                      : totalScore >= 60
                      ? "B"
                      : "C"}
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">
            Chart Komponen Ternormalisasi
          </h3>
          <ComponentChart components={components} />
        </div>
      </div>
    </div>
  );
}
