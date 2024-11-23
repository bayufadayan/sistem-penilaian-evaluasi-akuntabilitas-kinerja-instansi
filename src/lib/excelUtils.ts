/* eslint-disable @typescript-eslint/no-explicit-any */
import * as XLSX from "xlsx";

// Fungsi untuk membuat workbook Excel
export const createExcelFile = (data: any[], fileName: string, sheetName: string) => {
  const workbook = XLSX.utils.book_new(); // Buat workbook baru
  const worksheet = XLSX.utils.json_to_sheet(data); // Konversi data JSON ke worksheet
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName); // Tambahkan sheet ke workbook
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
