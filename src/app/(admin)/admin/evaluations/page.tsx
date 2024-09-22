import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminAddButton from "../../components/adminAddButton";
import { AiOutlineFileDone } from "react-icons/ai"; // Contoh ikon dari react-icons
import { BsCardChecklist } from "react-icons/bs";
// import AdminEditButton from "../../components/buttons/adminEditButton";
// import DeleteEvaluation from "./deleteEvaluation";

const getEvalSheets = async () => {
  const res = await prisma.evaluationSheet.findMany({
    select: {
      id: true,
      title: true,
      date_start: true,
      date_finish: true,
      description: true,
      status: true,
      year: true,
      color: true,
    },
  });
  return res.map((sheet) => {
    if (sheet.status === "PENDING") {
      sheet.color = "bg-gradient-to-r from-yellow-400 to-yellow-500";
    } else if (sheet.status === "COMPLETED") {
      sheet.color = "bg-gradient-to-r from-green-400 to-green-600";
    } else if (sheet.status === "IN_PROGRESS") {
      sheet.color = "bg-gradient-to-r from-cyan-500 via-blue-600 to-blue-800";
    } else if (sheet.status === "CANCELLED") {
      sheet.color = "bg-gradient-to-r from-red-500 via-red-600 to-red-700";
    }
    return sheet;
  });
};

export default async function EvaluationPage() {
  const [evalsheets] = await Promise.all([getEvalSheets()]);

  // Fungsi untuk memformat tanggal
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-4 text-gray-500">
        <Link href="#" className="text-blue-600">
          Dashboard
        </Link>
        / Lembar Kerja Evaluasi
      </div>

      {/* Manajemen User */}
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-2xl font-semibold mb-4">Manajemen Tim</h1>
        <AdminAddButton props="/admin/evaluations/create/" label="Tambah LKE" />
      </div>

      {/* Kumpulan Kartu */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {evalsheets.length > 0 ? (
          evalsheets.map((evalsheet) => (
            <Link
              href={`/admin/evaluations/edit/${evalsheet.id}`}
              key={evalsheet.id}
            >
              <div
                className={`relative p-6 rounded-lg shadow-md ${evalsheet.color} hover:shadow-lg transition-shadow duration-300 flex flex-col h-full`}
              >
                {/* Ikon transparan di background */}
                <div className="absolute inset-0 flex items-center justify-end opacity-30 text-white text-8xl font-bold right-10">
                  {evalsheet.status === "COMPLETED" ? (
                    <AiOutlineFileDone />
                  ) : (
                    <BsCardChecklist />
                  )}
                </div>

                {/* Konten Kartu */}
                <div className="relative z-10 flex flex-col flex-grow">
                  <div className="text-left mb-4 text-2xl font-bold text-white">
                    {evalsheet.title.toUpperCase()}
                  </div>
                  <p className="text-white opacity-80 flex-grow">
                    {evalsheet.description === ""
                      ? "Tidak ada Deskripsi"
                      : evalsheet.description}
                  </p>
                  <p className="text-white mt-2">
                    Mulai: <b>{formatDate(evalsheet.date_start)}</b>
                  </p>
                  <p className="text-white">
                    Selesai: <b>{formatDate(evalsheet.date_finish)}</b>
                  </p>

                  <div className="rounded p-1 bg-white font-semibold mt-3 text-center w-1/2">
                    <p
                      className={`font-medium text-sm ${
                        evalsheet.status === "COMPLETED"
                          ? "text-green-600"
                          : evalsheet.status === "PENDING"
                          ? "text-yellow-600"
                          : evalsheet.status === "IN_PROGRESS"
                          ? "text-blue-600"
                          : evalsheet.status === "CANCELLED"
                          ? "text-red-600"
                          : "text-gray-900"
                      }`}
                    >
                      Status: {evalsheet.status}
                    </p>
                  </div>

                  <div>
                    tes button
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-200">Data tidak ditemukan</p>
        )}
      </div>
    </div>
  );
}
