"use client"
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { TiHome } from "react-icons/ti";
import { IoIosArrowForward } from "react-icons/io";
import ScoreTable from "./scoreTable";

export default function ScoreManagementPage() {
  const [evaluations, setEvaluations] = useState<{ id: string; title: string }[]>(
    []
  );
  const [selectedLKE, setSelectedLKE] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const response = await fetch("/api/evaluations");
        const data = await response.json();
        setEvaluations(data);
      } catch (error) {
        console.error("Failed to fetch evaluations:", error);
      }
    };

    fetchEvaluations();
  }, []);

  const handleLKEChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedLKE(value === "" ? null : value);
  };

  useEffect(() => {
    document.title = "Manajemen Nilai";
  });

  return (
    <div>
      <div className="mb-4 text-gray-500 flex gap-1 items-start">
        <Link href="/admin" className="text-blue-600">
          <span className="flex gap-1">
            <TiHome className="mt-0.5" /> Dashboard
          </span>
        </Link>
        <IoIosArrowForward className="h-5 w-5" />
        <span>Manajemen Nilai</span>
      </div>

      <div className="flex justify-between items-center mb-1">
        <h1 className="text-2xl font-semibold mb-4">Manajemen Nilai</h1>
      </div>

      <div className="flex items-end justify-start gap-4">
        {/* Dropdown Select */}
        <form className="h-full">
          <select
            id="countries"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 h-[44px]"
            onChange={handleLKEChange}
            value={selectedLKE || ""}
          >
            <option disabled>
              Pilih Lembar Kerja Evaluasi
            </option>
            <option value="">
              Semua
            </option>
            {evaluations.map((evaluation) => (
              <option key={evaluation.id} value={evaluation.id}>
                {evaluation.title}
              </option>
            ))}
          </select>
        </form>
      </div>

      <ScoreTable selectedLKE={selectedLKE} />

    </div>
  );
}
