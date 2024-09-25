"use client";
import * as XLSX from "xlsx";
import { useState } from "react";
import axios from "axios";
import { SiGooglesheets } from "react-icons/si";
import { useRouter } from "next/navigation";

type ExcelRow = {
    No: number;
    "Nama Sub Komponen": string;
    Deskripsi?: string;
    Bobot: number;
};

export default function UploadExcel({ componentId }: { componentId: string }) {
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

        setFile(null)
    };

    const sendExcelDataToAPI = async (data: ExcelRow[]) => {
        for (const row of data) {
            if (
                !row.No ||
                !row["Nama Sub Komponen"] ||
                !row.Bobot
            ) {
                console.error("Data tidak lengkap pada row:", row);
                continue;
            }

            const payload = {
                subcomponent_number: row.No,
                name: row["Nama Sub Komponen"],
                description: row.Deskripsi || "",
                weight: row.Bobot,
                id_components: componentId,
            };

            await axios.post("/api/subcomponents", payload);
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
                className="h-full inline-flex gap-1 items-center px-4 py-3 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 active:bg-green-800 transition-all transform active:scale-95 shadow-md"
            >
                <SiGooglesheets className="w-5 h-5" />
                Import Excel
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
