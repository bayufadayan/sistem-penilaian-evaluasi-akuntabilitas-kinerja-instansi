"use client"
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AiOutlineFileDone } from "react-icons/ai";
import { BsCardChecklist } from "react-icons/bs";
import { FiExternalLink } from "react-icons/fi";
import { TiHome } from "react-icons/ti";
import { IoIosArrowForward } from "react-icons/io";
import { Helmet } from "react-helmet";
import dynamic from "next/dynamic";
import { useDataContext } from "../../layout";
import { EvaluationSheet } from "@prisma/client";

const AdminAddButton = dynamic(() => import("../../components/adminAddButton"), { ssr: false });
const EditEvaluation = dynamic(() => import("./editEvaluation"), { ssr: false });
const DeleteEvaluation = dynamic(() => import("./deleteEvaluation"), { ssr: false });
const GenerateTemplateButton = dynamic(() => import("./generateTemplateButton"), { ssr: false });

export default function EvaluationPage() {
  const [evalsheets, setEvalsheets] = useState<EvaluationSheet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dataContext = useDataContext();

  const fetchEvaluations = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/evaluations");
      if (!response.ok) {
        throw new Error("Failed to fetch evaluations");
      }
      const evaluationsData = await response.json();

      evaluationsData.map((sheet: EvaluationSheet) => {
        sheet.date_start = new Date(sheet.date_start);
        sheet.date_finish = new Date(sheet.date_finish);

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

      setIsLoading(false);
      setEvalsheets(evaluationsData);
    } catch (error) {
      setIsLoading(false);
      console.error("Failed to fetch evaluations:", error);
    }
  }, []);

  useEffect(() => {
    fetchEvaluations();
  }, [fetchEvaluations]);

  const onDeleteSuccess = async () => {
    try {
      await fetchEvaluations();
    } catch (error) {
      console.error("Error eksekusi sukses delete:", error);
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  return (
    <>
      <Helmet>
        <title>Manajemen Lembar Kerja Evaluasi | {dataContext?.appNameContext}</title>
        <meta name="description" content="Mengelola Data Akun user" />
      </Helmet>
      <div>
        {/* Breadcrumb */}
        <div className="mb-4 text-gray-500 flex gap-1 items-start">
          <Link href="/admin" className="text-blue-600">
            <span className="flex gap-1"><TiHome className="mt-0.5" /> Dashboard</span>
          </Link>
          <IoIosArrowForward className="h-5 w-5" />
          <span>Lembar Kerja Evaluasi</span>
        </div>

        {/* Manajemen User */}
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-2xl font-semibold mb-4">Manajemen Lembar Kerja Evaluasi</h1>
          <div className="flex flex-row items-start justify-center">
            <AdminAddButton props="/admin/evaluations/create/" label="Tambah LKE" />
            <GenerateTemplateButton onSuccess={async () => {
              await onDeleteSuccess();
            }} />
          </div>
        </div>

        {/* Kumpulan Kartu */}
        {evalsheets.length > 0 ?
          (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {evalsheets.map((evalsheet) => (
              <div
                key={evalsheet.id}
                className={`relative p-6 rounded-lg shadow-md ${evalsheet.color} hover:shadow-lg transition-shadow duration-300 flex flex-col h-full`}
              >
                <div className="absolute inset-0 flex items-center justify-end opacity-30 text-white text-9xl font-bold right-5">
                  {evalsheet.status === "COMPLETED" ? (
                    <AiOutlineFileDone />
                  ) : (
                    <BsCardChecklist />
                  )}
                </div>

                {/* Konten Kartu */}
                <div className="relative flex flex-col flex-grow">
                  <div className="text-left text-2xl font-bold text-white">
                    {evalsheet.title.toUpperCase()}
                  </div>
                  <hr className="border-1 border-white/20 my-1 mb-2" />
                  <p className="text-white opacity-80 flex-grow italic">
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

                  <div className="rounded p-1 bg-white font-semibold mt-3 text-center w-2/3">
                    <p
                      className={`font-medium text-sm ${evalsheet.status === "COMPLETED"
                        ? "text-green-600"
                        : evalsheet.status === "PENDING"
                          ? "text-yellow-600"
                          : evalsheet.status === "IN_PROGRESS"
                            ? "text-blue-600"
                            : evalsheet.status === "CANCELLED"
                              ? "text-red-600"
                              : "text-gray-900"}`}
                    >
                      Status: {evalsheet.status}
                    </p>
                  </div>

                  {/* Edit dan Delete Button */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <EditEvaluation
                      editUrl={`/admin/evaluations/edit/${evalsheet.id}`} />
                    <DeleteEvaluation evaluationSheet={evalsheet} onDeleteSuccess={async () => {
                      await onDeleteSuccess();
                    }} />
                    <Link href={`/admin/evaluations/${evalsheet.id}/component`}>
                      <button
                        type="button"
                        className="flex items-center gap-2 px-4 py-2 border-2 border-white/50 text-slate-200 rounded-lg shadow-md hover:bg-white/25 transition-all duration-200 h-full"
                      >
                        <FiExternalLink className="w-5 h-5" />
                        <span className="font-semibold">Lihat</span>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}

          </div>
          ) : (
            <div className="flex items-center justify-center w-full h-full rounded-lg">
              <p className="text-gray-400 text-lg font-semibold pt-24">{isLoading ? "Loading..." : "Lembar Evaluasi Kosong"}</p>
            </div>
          )}
      </div>
    </>
  );
}
