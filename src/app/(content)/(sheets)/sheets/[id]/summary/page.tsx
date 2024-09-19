import React from "react";
import styles from "@/styles/styles.module.css";

export default function SummaryScore() {
  return (
    <div className={`${styles.lkeContentContainer} h-screen`}>
      <div className={styles.lkeContent}>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500  ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">
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
                  Nilai 2021
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b     hover:bg-gray-50 ">
                <td className="px-6 py-4 font-medium text-gray-900  ">1</td>
                <td className="px-6 py-4">Perencanaan Kinerja</td>
                <td className="px-6 py-4 text-right">30,00</td>
                <td className="px-6 py-4 text-right">24,60</td>
              </tr>
              <tr className="bg-white border-b     hover:bg-gray-50 ">
                <td className="px-6 py-4 font-medium text-gray-900  ">2</td>
                <td className="px-6 py-4">Pengukuran Kinerja</td>
                <td className="px-6 py-4 text-right">30,00</td>
                <td className="px-6 py-4 text-right">23,70</td>
              </tr>
              <tr className="bg-white border-b     hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900  ">3</td>
                <td className="px-6 py-4">Pelaporan Kinerja</td>
                <td className="px-6 py-4 text-right">15,00</td>
                <td className="px-6 py-4 text-right">12,00</td>
              </tr>
              <tr className="bg-white border-b     hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900  ">4</td>
                <td className="px-6 py-4">
                  Evaluasi Akuntabilitas Kinerja Internal
                </td>
                <td className="px-6 py-4 text-right">25,00</td>
                <td className="px-6 py-4 text-right">19,25</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="font-bold bg-gray-100">
                <td
                  colSpan={2}
                  className="px-6 py-3 text-right border-t border-gray-300  "
                >
                  Nilai Akuntabilitas Kinerja
                </td>
                <td className="px-6 py-3 text-right border-t border-gray-300  ">
                  79,55
                </td>
                <td className="px-6 py-3 text-center border-t border-gray-300  ">
                  BB
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
