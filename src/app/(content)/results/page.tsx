"use client";
import React from 'react'
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styles from "@/styles/styles.module.css";
import Link from 'next/link';
import { FiExternalLink } from "react-icons/fi";

interface EvaluationSheet {
  id: string;
  title: string;
  date_start: string | Date;
  date_finish: string | Date;
  description: string;
  status: string;
  year: string;
  evaluationSheetScore: EvaluationSheetScore[];
}

interface EvaluationSheetScore {
  id: number;
  nilai: number | null;
  grade: string | null;
  id_LKE: string;
}

export default function TempResultPage() {
  const [completedSheets, setCompletedSheets] = useState<EvaluationSheet[]>([]);
  const { status }: { data: unknown; status: string } =
    useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    const fetchSheets = async () => {
      const res = await fetch("/api/evaluations");
      const sheets: EvaluationSheet[] = await res.json();

      const completed = sheets.filter((sheet) => sheet.status === "COMPLETED");
      setCompletedSheets(completed);
    };

    fetchSheets();
  }, [router, status]);
  return (
    <main className={`${styles.mainContainer} min-h-[90vh]`}>
      <div className={styles.mainContent}>
        <div className={`mt-20`}>
          <h1 className="font-bold text-3xl mb-4 text-black">Daftar Lembar Kerja Evaluasi Selesai ({completedSheets.length})</h1>
          {completedSheets.length === 0 ? (
            <div className={styles.evaluationCardSection}>
              <p className='text-black'>Tidak ada LKE ditemukan</p>
            </div>
          ) : (
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
                  <tr>
                    <th scope="col" className="px-6 py-3">#</th>
                    <th scope="col" className="px-6 py-3">Name</th>
                    <th scope="col" className="px-6 py-3">Mulai Pelaksanaan</th>
                    <th scope="col" className="px-6 py-3">Selesai Pelaksanaan</th>
                    <th scope="col" className="px-6 py-3">Tahun</th>
                    <th scope="col" className="px-6 py-3">Nilai</th>
                    <th scope="col" className="px-6 py-3">Grade</th>
                    <th scope="col" className="px-6 py-3 font-bold text-xl"><FiExternalLink /></th>
                  </tr>
                </thead>
                <tbody>
                  {completedSheets.map((sheet, index) => (
                    <tr key={sheet.id} className="odd:bg-white even:bg-gray-50 text-center hover:bg-gray-50">
                      <td className="px-6 py-4">{index + 1}</td>
                      <td scope='row' className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-left">{sheet.title}</td>
                      <td className="px-6 py-4">
                        {new Date(sheet.date_start).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(sheet.date_finish).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-6 py-4">{sheet.year}</td>
                      <td className="px-6 py-4">{sheet.evaluationSheetScore[0]?.nilai || "-"}</td>
                      <td className="px-6 py-4">{sheet.evaluationSheetScore[0]?.grade || "-"}</td>
                      <td className="px-6 py-4">
                        <Link href={`/sheets/${sheet.id}/summary`} className='py-2 px-4 bg-blue-500 text-white font-bold rounded-md shadow-md '>
                          Lihat Detail
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
