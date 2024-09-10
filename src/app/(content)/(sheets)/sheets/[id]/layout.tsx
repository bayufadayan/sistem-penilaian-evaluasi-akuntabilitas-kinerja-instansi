"use client";
import { SessionProvider } from "next-auth/react";
import "../../../../globals.css";
import styles from "@/styles/styles.module.css";
import { useEffect, useState, createContext, useContext } from "react";
import SidebarUser from "@/components/sidebarUser";
import type React from "react";

interface Component {
  id: number;
  name: string;
  description: string;
  weight: number;
  subComponents: SubComponent[];
}

interface SubComponent {
  id: number;
  name: string;
  description: string;
  weight: number;
}

interface EvaluationSheet {
  id: string;
  title: string;
  description: string;
  components: Component[];
}

const DataContext = createContext<{
  myComponents: Component[];
  evaluationName: string;
  evaluationId: string;
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
    return <p>Loading...</p>;
  }

  const myComponents = evaluation.components;
  const evaluationName = evaluation.title
  const evaluationId = evaluation.id

  return (
    <SessionProvider>
      <DataContext.Provider value={{ myComponents, evaluationName, evaluationId }}>
        <main className={`${styles.mainContainer} ${styles.lkeFilling}`}>
          <SidebarUser
            components={evaluation.components}
            evaluationTitle={evaluation.title}
            evaluationId={evaluation.id}
          />
          {children}
        </main>
      </DataContext.Provider>
    </SessionProvider>
  );
}
