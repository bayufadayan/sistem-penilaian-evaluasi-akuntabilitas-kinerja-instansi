"use client";
import React, { useState } from "react";
import { FaFilePdf, FaFileExcel } from "react-icons/fa";
import axios from "axios";
import { generateEvaluationPDF } from "@/lib/pdfExport";

interface ExportButtonsProps {
  evaluationId: string;
  evaluationTitle: string;
}

export default function ExportButtons({
  evaluationId,
  evaluationTitle,
}: ExportButtonsProps) {
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);

  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    try {
      // Fetch full evaluation data
      const response = await axios.get(`/api/evaluations/${evaluationId}`);
      await generateEvaluationPDF(response.data);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("Gagal mengexport PDF. Silakan coba lagi.");
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleExportExcel = async () => {
    setIsExportingExcel(true);
    try {
      const response = await fetch(`/api/export/excel/${evaluationId}`);
      
      if (!response.ok) {
        throw new Error("Failed to export Excel");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Evaluasi_${evaluationTitle.replace(/\s+/g, "_")}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting Excel:", error);
      alert("Gagal mengexport Excel. Silakan coba lagi.");
    } finally {
      setIsExportingExcel(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleExportPDF}
        disabled={isExportingPDF}
        className="btn btn-error btn-sm gap-2"
        title="Export ke PDF"
      >
        {isExportingPDF ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : (
          <FaFilePdf className="w-4 h-4" />
        )}
        {isExportingPDF ? "Exporting..." : "PDF"}
      </button>

      <button
        onClick={handleExportExcel}
        disabled={isExportingExcel}
        className="btn btn-success btn-sm gap-2"
        title="Export ke Excel"
      >
        {isExportingExcel ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : (
          <FaFileExcel className="w-4 h-4" />
        )}
        {isExportingExcel ? "Exporting..." : "Excel"}
      </button>
    </div>
  );
}
