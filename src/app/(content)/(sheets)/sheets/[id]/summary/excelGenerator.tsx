import React from "react";
import { createExcelFile } from "@/lib/excelUtils";
import { FaFileExcel } from "react-icons/fa";
import type { ComponentScore, Score } from "@prisma/client";

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

type CriteriaDetails = {
  id: number;
  name: string;
  description: string;
  criteria_number: number;
  id_subcomponents: number;
  score: Score[];
};

type SubComponentScore = {
  id: number;
  nilaiAvgOlah: number;
  nilai: number;
  persentase: number;
  grade: string;
  id_subcomponents: number;
};

type ExcelGeneratorProps = {
  components: ComponentDetail[];
  evaluationName: string;
  year: number;
  totalScore: number;
};

const ExcelGenerator: React.FC<ExcelGeneratorProps> = ({
  components,
  evaluationName,
  year,
}) => {
  // Fungsi untuk mempersiapkan data Excel
  const handleExport = () => {
    // Data terstruktur untuk Excel
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedData: any[] = [];

    components.forEach((component, compIndex) => {
      // Tambahkan data Komponen
      formattedData.push({
        No: compIndex + 1,
        "Nama Komponen": component.name,
        Bobot: component.weight.toFixed(2),
        Nilai: component.componentScore?.[0]?.nilai?.toFixed(2) ?? "N/A",
        "Sub Komponen": "",
        Kriteria: "",
        "Skor Kriteria": "",
        "Catatan": "",
      });

      component.subComponents.forEach((subComponent, subIndex) => {
        // Tambahkan data Sub Komponen
        formattedData.push({
          No: `${compIndex + 1}.${subIndex + 1}`,
          "Nama Komponen": "",
          Bobot: "",
          Nilai: "",
          "Sub Komponen": subComponent.name,
          Kriteria: "",
          "Skor Kriteria": "",
          "Catatan": "",
        });

        subComponent.criteria.forEach((criterion, critIndex) => {
          // Tambahkan data Kriteria
          formattedData.push({
            No: `${compIndex + 1}.${subIndex + 1}.${critIndex + 1}`,
            "Nama Komponen": "",
            Bobot: "",
            Nilai: "",
            "Sub Komponen": "",
            Kriteria: criterion.name,
            "Skor Kriteria": criterion.score?.[0]?.score ?? "N/A",
            "Catatan": criterion.score?.[0]?.notes ?? "N/A",
          });
        });
      });
    });

    // Ekspor data ke Excel
    createExcelFile(formattedData, `Hasil ${evaluationName} ${year}`, "Sheet1");
  };

  return (
    <button
      onClick={handleExport}
      className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded flex text-sm font-medium items-center shadow-md transform active:scale-95 transition-transform duration-150"
    >
      <FaFileExcel className="mr-2" />
      Download Excel
    </button>
  );
};

export default ExcelGenerator;
