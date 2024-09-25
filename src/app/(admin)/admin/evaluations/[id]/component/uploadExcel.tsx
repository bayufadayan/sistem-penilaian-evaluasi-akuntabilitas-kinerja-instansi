"use client";
import * as XLSX from "xlsx";
import { useState } from "react";
import axios from "axios";
import { SiGooglesheets } from "react-icons/si";
import { useRouter } from "next/navigation";

type ExcelRow = {
  No : number;
  "Nama Komponen": string;
  Deskripsi?: string;
  Bobot: number;
  Team: number;
};

export default function UploadExcel({ id_LKE }: { id_LKE: string }) {
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      handleFileUpload(selectedFile);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData: ExcelRow[] = XLSX.utils.sheet_to_json(worksheet);

      await sendExcelDataToAPI(jsonData);

      setIsLoading(false);
    };

    reader.readAsArrayBuffer(file);
  };

  const sendExcelDataToAPI = async (data: ExcelRow[]) => {
    for (const row of data) {
      if (
        !row.No ||
        !row["Nama Komponen"] ||
        !row.Bobot ||
        !row.Team
      ) {
        console.error("Data tidak lengkap pada row:", row);
        continue;
      }

      const payload = {
        component_number: row.No,
        name: row["Nama Komponen"],
        description: row.Deskripsi || "",
        weight: row.Bobot,
        id_team: row.Team,
        id_LKE: id_LKE,
      };

      await axios.post("/api/components", payload);
    }

    router.refresh();
  };

  const triggerFileInput = () => {
    document.getElementById('fileInput')?.click();
  };

  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={triggerFileInput}
        className="h-[80%] flex items-center gap-1 text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
      >
        <SiGooglesheets className="w-6 h-6"/>
        <strong className="font-semibold text-md">Import Excel</strong>
      </button>

      <input
        id="fileInput"
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
        className="hidden"
      />

      {isLoading && <p>Loading...</p>}
    </div>
  );
}
