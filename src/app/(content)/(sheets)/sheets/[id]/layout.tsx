"use client";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import styles from "@/styles/styles.module.css";
import { useEffect, useState, createContext, useContext } from "react";
import SidebarUser from "@/components/sidebarUser";
import type { Component } from "@prisma/client";

import type React from "react";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

interface SubComponent {
  id: number;
  name: string;
  description: string;
  weight: number;
  subcomponent_number: number;
}

type ComponentWithSubComponents = Component & {
  subComponents: SubComponent[];
  team: Team;
};

interface EvaluationSheet {
  id: string;
  title: string;
  description: string;
  status: string;
  components: ComponentWithSubComponents[];
}
interface Team {
  id: number;
  name: string;
}

const DataContext = createContext<{
  myComponents: Component[];
  evaluationName: string;
  evaluationId: string;
  evaluationDesc: string;
  evaluationStatus: string;
} | null>(null);

export const useDataContext = () => useContext(DataContext);

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { id: string };
}>) {
  const [evaluation, setEvaluation] = useState<EvaluationSheet | null>(null);
  const id = params.id;

  useEffect(() => {
    const fetchEvaluationSheet = async () => {
      if (id) {
        const res = await fetch(`/api/evaluations/${id}`);
        const data = await res.json();
        setEvaluation(data);
      }
    };
    fetchEvaluationSheet();
  }, [id]);

  if (!evaluation) {
    return (
      <div
        className={`${inter.className} h-screen flex items-center justify-center`}
      >
        <div className="block max-w-sm p-5 bg-white border border-gray-200 rounded-lg shadow mb-8">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 flex justify-center items-center gap-3">
            <svg
              aria-hidden="true"
              className="w-14 h-14 text-gray-200 animate-spin dark:text-gray-100 fill-blue-400 mr-3"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>{" "}
            Sedang Memuat Data
          </h5>
        </div>
      </div>
    );
  }

  const myComponents = evaluation.components;
  const evaluationName = evaluation.title;
  const evaluationId = evaluation.id;
  const evaluationDesc = evaluation.description;
  const evaluationStatus = evaluation.status;

  return (
    <DataContext.Provider
      value={{ myComponents, evaluationName, evaluationId, evaluationDesc, evaluationStatus }}
    >
      <main className={`bg-[#ecf1f4] md:py-0 md:px-0 ${styles.lkeFilling}`}>
        {
          evaluation.status !== "IN_PROGRESS" && evaluation.status !== "COMPLETED"
            ? <div className="z-[70] fixed w-screen h-screen bg-slate-600 text-white flex flex-col items-center justify-center gap-3">
              <span>
                ({evaluation.title})
              </span>
              <h1 className="font-bold text-white text-3xl">
                <strong className="flex text-red-500 p-2 rounded bg-white w-fit">
                  STATUS: {evaluation.status}
                </strong>
              </h1>
              <span className="w-2/3 text-center">
                Mohon maaf, Anda saat ini tidak dapat mengisi atau melihat &quot;{evaluation.title}&quot; karena statusnya saat ini adalah {evaluation.status}. Silakan kembali lagi nanti.
              </span>
              <small className="italic">Jika Anda merasa ini adalah kesalahan, silakan hubungi admin untuk bantuan lebih lanjut.</small>
              <div>
                <Link href={"/"} className="underline text-blue-300 cursor-pointer hover:text-green-400">
                  Kembali ke Beranda
                </Link>
              </div>
            </div>
            : null
        }
        <SidebarUser
          components={evaluation.components}
          evaluationTitle={evaluation.title}
          evaluationId={evaluation.id}
        />
        {children}
      </main>
    </DataContext.Provider>
  );
}
