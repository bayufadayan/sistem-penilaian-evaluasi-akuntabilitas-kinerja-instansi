"use client";
import React, { useEffect, useState, useCallback } from "react";
import styles from "@/styles/styles.module.css";
import axios from "axios";
import { useDataContext } from "../layout";
import { FaChartLine, FaStar } from "react-icons/fa";
import ComponentChart from "./chartComponent";
import PdfGenerator from "./pdfGenerator";
import ExcelGenerator from "./excelGenerator";
import type { ComponentScore, Score } from "@prisma/client";
import Link from "next/link";

type CriteriaData = {
  id: number;
  name: string;
  description?: string;
  criteria_number: number;
};

type SubComponentDetail = {
  id: number;
  name: string;
  description?: string;
  weight: number;
  subcomponent_number: number;
  criteria: CriteriaData[];
};

type CriteriaDetails = {
  id: number;
  name: string;
  description: string;
  criteria_number: number;
  id_subcomponents: number;
  score: Score[];
};

// Tipe untuk detail sub-komponen
type SubComponentsDetail = {
  id: number;
  name: string;
  description: string;
  weight: number;
  subcomponent_number: number;
  id_components: number;
  subComponentScore: SubComponentScore[];
  criteria: CriteriaDetails[];
};

// Tipe untuk skor sub-komponen
type SubComponentScore = {
  id: number;
  nilaiAvgOlah: number;
  nilai: number;
  persentase: number;
  grade: string;
  id_subcomponents: number;
};

// Tipe untuk detail komponen
type ComponentDetail = {
  id: number;
  name: string;
  description: string;
  weight: number;
  component_number: number;
  id_team: number;
  id_LKE: string;
  componentScore: ComponentScore[];
  subComponents: SubComponentsDetail[];
};

export default function SummaryScore() {
  const { evaluationId } = useDataContext() || {};
  const [components, setComponents] = useState<ComponentDetail[]>([]);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [totalSubComponents, setTotalSubComponents] = useState<number>(0);
  const [totalCriteria, setTotalCriteria] = useState<number>(0);
  const [evaluationName, setEvaluationName] = useState("");
  const [year, setYear] = useState<number>(0);
  const [dateRange, setDateRange] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateFinish, setDateFinish] = useState("");
  const [description, setDescription] = useState("");
  const dataContext = useDataContext();

  const saveTotalScore = useCallback(
    async (total: number) => {
      try {
        const grade =
          total > 90 ?
            "AA" :
            total > 80 ?
              "A" :
              total > 70 ?
                "BB" :
                total > 60 ?
                  "B" :
                  total > 50 ?
                    "CC" :
                    total > 30 ?
                      "C" :
                      total <= 30 ?
                        "D" :
                        "Belum Input";

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

  // Fungsi untuk memformat dateRange
  const formatDateRange = useCallback((start: string, finish: string) => {
    const startDate = new Date(start);
    const finishDate = new Date(finish);

    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "long",
      year: "numeric",
    };

    const formattedStart = startDate.toLocaleDateString("id-ID", options);
    const formattedFinish = finishDate.toLocaleDateString("id-ID", options);

    return `${formattedStart} sampai ${formattedFinish}`;
  }, []);

  const formatDate = useCallback((date: string) => {
    const myDate = new Date(date);

    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "long",
    };

    const formattedDate = myDate.toLocaleDateString("id-ID", options);

    return `${formattedDate}`;
  }, []);

  useEffect(() => {
    if (!evaluationId) return;

    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/evaluations/${evaluationId}`);
        const {
          components,
          title,
          year,
          date_start,
          date_finish,
          description,
        } = response.data;

        const total = components.reduce(
          (acc: number, component: ComponentDetail) => {
            const componentTotal = component.componentScore?.[0]?.nilai ?? 0;
            return acc + componentTotal;
          },
          0
        );

        const totalSubComponents = components.reduce(
          (acc: number, component: ComponentDetail) => {
            return acc + (component.subComponents?.length || 0);
          },
          0
        );

        const totalCriteria = components.reduce(
          (acc: number, component: ComponentDetail) => {
            return (
              acc +
              component.subComponents.reduce(
                (subAcc: number, subComponent: SubComponentDetail) =>
                  subAcc + (subComponent.criteria?.length || 0),
                0
              )
            );
          },
          0
        );

        setEvaluationName(title);
        setYear(year);
        setDateStart(formatDate(date_start));
        setDateFinish(formatDate(date_finish));
        setDescription(description);
        setDateRange(formatDateRange(date_start, date_finish));
        setComponents(components);
        setTotalScore(total);
        setTotalSubComponents(totalSubComponents);
        setTotalCriteria(totalCriteria);

        saveTotalScore(total);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [evaluationId, saveTotalScore, formatDateRange, formatDate]);

  return (
    <div className={`${styles.lkeContentContainer} min-h-screen`}>
      <div className={`${styles.lkeContent}`}>
        <div className={styles.fillCriteriaHeader}>
          <div className={styles.breadcrumb}>
            <Link href={`/`} className="text-blue-700 font-semibold hover:text-green-600">
              Beranda
            </Link>{" "}
            <span>{" / "}</span>
            <Link href={`/sheets/${dataContext?.evaluationId}`} className="text-blue-600 hover:text-green-600 font-semibold">
              Lembar Kerja Evaluasi
            </Link>{" "}
            / Hasil LKE
          </div>

          <div className={styles.fillCriteriaHeroContainer}>
            <div className={styles.fillCriteriaHeaderContent}>
              <div className="flex w-full">
                <div
                  className={`${styles.mainTitle} flex flex-col md:flex-row justify-center md:justify-between w-full`}
                >
                  <h1 className="text-4xl font-bold md:text-left text-center">Hasil Pengisian AKIP</h1>
                  <div className="flex gap-2 justify-center md:mt-0 mt-3">
                    <ExcelGenerator
                      components={components}
                      evaluationName={evaluationName}
                      year={year}
                      totalScore={totalScore}
                    />
                    <PdfGenerator
                      components={components}
                      totalScore={totalScore}
                      evaluationName={evaluationName}
                      year={year}
                      dateRange={dateRange}
                      title={evaluationName}
                      description={description}
                      id={evaluationId}
                      date_start={dateStart}
                      date_finish={dateFinish}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-t-2 border-gray-300 my-2" />

        <div className="grid grid-cols-4 md:gap-6 mb-4 gap-4">
          {/* Card Detail Informasi */}
          <div className="col-span-4 md:col-span-2 p-5 bg-white rounded-lg shadow-lg border-l-4 border-blue-600">
            <div>
              <h2 className="text-md font-bold text-blue-600 mb-2">
                Detail Informasi
              </h2>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 bg-blue-50 rounded-lg flex justify-around flex-col">
                  <p className="text-sm font-semibold text-gray-600">
                    Komponen
                  </p>
                  <p className="text-xxl font-bold text-blue-600">
                    {components.length}
                  </p>
                </div>
                <div className="text-center p-2 bg-blue-50 rounded-lg flex justify-around flex-col">
                  <p className="text-sm font-semibold text-gray-600">
                    Sub Komponen
                  </p>
                  <p className="text-xxl font-bold text-blue-600">
                    {totalSubComponents}
                  </p>
                </div>
                <div className="text-center p-2 bg-blue-50 rounded-lg flex justify-around flex-col">
                  <p className="text-sm font-semibold text-gray-600">
                    Kriteria
                  </p>
                  <p className="text-xxl font-bold text-blue-600">
                    {totalCriteria}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 - Nilai LKE */}
          <div className="col-span-2 md:col-span-1 p-5 bg-white rounded-lg shadow-lg flex items-center justify-between border-l-4 border-green-600">
            <div>
              <h2 className="text-md font-bold text-green-600 mb-2">
                Nilai LKE
              </h2>
              <p className="text-3xl font-bold text-green-600">
                {totalScore.toFixed(2)}
              </p>
            </div>
            <FaChartLine className="w-12 h-12 text-green-100" />
          </div>

          {/* Card 3 - Grade LKE */}
          <div className="col-span-2 md:col-span-1 p-5 bg-white rounded-lg shadow-lg flex items-center justify-between border-l-4 border-yellow-500">
            <div>
              <h2 className="text-md font-bold text-yellow-500 mb-2">
                Grade LKE
              </h2>
              <p className="text-3xl font-bold text-yellow-500">
                {totalScore > 90 ?
                  "AA" :
                  totalScore > 80 ?
                    "A" :
                    totalScore > 70 ?
                      "BB" :
                      totalScore > 60 ?
                        "B" :
                        totalScore > 50 ?
                          "CC" :
                          totalScore > 30 ?
                            "C" :
                            totalScore <= 30 ?
                              "D" :
                              "Belum Input"}
              </p>
            </div>
            <FaStar className="w-12 h-12 text-yellow-100" />
          </div>
        </div>

        <div className="rounded bg-blue-600 text-white font-bold text-lg text-center py-4">
          <span>Nilai Akhir ({evaluationName})</span>
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
              {components.sort((a, b) => a.component_number - b.component_number).map((component, index) => (
                <tr
                  className={`bg-white border-b hover:bg-gray-100 ${index % 2 === 0 ? "bg-gray-50" : ""
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
                    {totalScore > 90 ?
                      "AA" :
                      totalScore > 80 ?
                        "A" :
                        totalScore > 70 ?
                          "BB" :
                          totalScore > 60 ?
                            "B" :
                            totalScore > 50 ?
                              "CC" :
                              totalScore > 30 ?
                                "C" :
                                totalScore <= 30 ?
                                  "D" :
                                  "Belum Input"}
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="mt-10">
          <h3 className="text-2xl font-bold mb-4 text-center">
            Perbandingan Komponen dengan Maksimal Bobotnya
          </h3>
          <ComponentChart components={components} />
        </div>
      </div>
    </div>
  );
}
