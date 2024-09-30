"use client";
import React from "react";
import * as XLSX from "xlsx";
import { FaDownload } from "react-icons/fa";
import type { ComponentDetail } from "./pdfGenerator"; // Ensure ComponentDetail is correctly exported from your pdfGenerator file

interface ExcelGeneratorProps {
  components: ComponentDetail[];
  evaluationName: string;
  year: number;
}

const ExcelGenerator: React.FC<ExcelGeneratorProps> = ({
  components,
  evaluationName,
  year,
}) => {
  const downloadExcel = () => {
    // Create the workbook and worksheet
    const workbook = XLSX.utils.book_new();

    const data: (string | number)[][] = []; // Define the array type as (string | number)[][] for better type safety
    data.push([
      "NO",
      "Komponen",
      "Bobot",
      "Nilai",
      "Sub Komponen",
      "Bobot Sub Komponen",
      "Nilai Sub Komponen",
      "Kriteria",
      "Nilai Kriteria",
    ]);

    // Sort components and iterate over them using for...of to satisfy ESLint rules.
    components.sort((a, b) => a.component_number - b.component_number);
    for (const [index, component] of components.entries()) {
      component.subComponents.sort((a, b) => a.subcomponent_number - b.subcomponent_number);
      for (const subComponent of component.subComponents) {
        subComponent.criteria.sort((a, b) => a.criteria_number - b.criteria_number);
        for (const criterion of subComponent.criteria) {
          data.push([
            index + 1,
            component.name, // Display component name
            component.weight, // Display component weight
            component.componentScore[0]?.nilai || "", // Display score if available
            `${String.fromCharCode(64 + subComponent.subcomponent_number)}. ${subComponent.name}`,
            subComponent.weight,
            `${subComponent.subComponentScore[0]?.nilai} (${subComponent.subComponentScore[0]?.grade})`,
            `${criterion.criteria_number}. ${criterion.name}`,
            criterion.score[0]?.score || "",
          ]);
        }
      }
    }

    const worksheet = XLSX.utils.aoa_to_sheet(data);

    // Set the worksheet columns width
    const wscols = [
      { wch: 5 },  // NO
      { wch: 30 }, // Komponen
      { wch: 10 }, // Bobot
      { wch: 10 }, // Nilai
      { wch: 40 }, // Sub Komponen
      { wch: 10 }, // Bobot Sub Komponen
      { wch: 20 }, // Nilai Sub Komponen
      { wch: 50 }, // Kriteria
      { wch: 10 }, // Nilai Kriteria
    ];
    worksheet["!cols"] = wscols;

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hasil Evaluasi");

    // Generate Excel file and trigger download
    XLSX.writeFile(
      workbook,
      `Hasil_Evaluasi_AKIP_${evaluationName}_${year}.xlsx`
    );
  };

  return (
    <button
      onClick={downloadExcel}
      type="button"
      className="flex text-sm font-medium items-center bg-green-500 hover:bg-green-600 active:bg-green-700 text-white py-1 px-2 rounded shadow-md transform active:scale-95 transition-transform duration-150"
    >
      <FaDownload className="mr-2" />
      Download Excel
    </button>
  );
};

export default ExcelGenerator;
