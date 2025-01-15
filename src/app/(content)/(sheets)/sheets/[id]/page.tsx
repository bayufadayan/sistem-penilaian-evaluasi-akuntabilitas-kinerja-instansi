"use client";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import styles from "@/styles/styles.module.css";
import { useDataContext } from "./layout";
import Link from "next/link";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Score {
  id: string;
  score: string;
  notes: string | null;
  created_at: string;
  id_criterias: string;
  id_users: string | null;
}

interface Criteria {
  id: string;
  name: string;
  description: string | null;
  criteria_number: number;
  id_subcomponents: string;
  score: Score[];
}

interface SubComponent {
  id: string;
  name: string;
  description: string;
  weight: number;
  subcomponent_number: number;
  id_components: string;
  subComponentScore: Score[];
  criteria: Criteria[];
}

interface Component {
  id: string;
  name: string;
  description: string;
  weight: number;
  component_number: number;
  id_team: number;
  id_LKE: string;
  componentScore: Score[];
  subComponents: SubComponent[];
}

interface Evaluation {
  id: string;
  title: string;
  date_start: string | Date;
  date_finish: string | Date;
  description: string;
  status: string;
  year: string;
  color: string;
  components: Component[];
}

interface CriteriaStats {
  componentName: string;
  totalCriteria: number;
  emptyCriteriaCount: number;
  componentNumber: number;
}

export default function EvaluationSheetsPage() {
  const [criteriaStats, setCriteriaStats] = useState<CriteriaStats[]>([]);
  const dataContext = useDataContext();

  useEffect(() => {
    if (!dataContext) return;

    const fetchCriteriaCount = async () => {
      const res = await fetch(`/api/evaluations/${dataContext.evaluationId}`);
      const data: Evaluation = await res.json();

      const stats = data.components.map((component: Component) => {
        const totalCriteria = component.subComponents.flatMap(
          (subComponent: SubComponent) => subComponent.criteria
        );

        const emptyCriteriaCount = totalCriteria.filter(
          (criteria: Criteria) => criteria.score[0].score === ""
        ).length;

        return {
          componentName: component.name,
          totalCriteria: totalCriteria.length,
          emptyCriteriaCount,
          componentNumber: component.component_number
        };
      });

      setCriteriaStats(stats);
    };

    fetchCriteriaCount();
  }, [dataContext]);

  const chartData = {
    labels: criteriaStats
      .sort((a, b) => a.componentNumber - b.componentNumber)
      .map((stat) => {
        const componentName = stat.componentName.split(" ").map((word) => {
          return word.slice(0);
        });
        return componentName;
      }),

    datasets: [
      {
        label: "Progress Pengisian (%)",
        data: criteriaStats
          .sort((a, b) => a.componentNumber - b.componentNumber)
          .map(
            (stat) =>
              ((stat.totalCriteria - stat.emptyCriteriaCount) / stat.totalCriteria) *
              100
          ),
        backgroundColor: "rgba(75, 192, 192, 0.4)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    indexAxis: 'y' as const,
    plugins: {
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        min: 0,
        max: 100,
        grid: {
          drawOnChartArea: true,
          borderColor: "rgba(0, 0, 0, 0.2)",
          borderWidth: 2,
          lineWidth: 2,
        },
        ticks: {
          stepSize: 5,
        },
      },
      y: {
        grid: {
          drawOnChartArea: true,
          borderColor: "rgba(0, 0, 0, 0.2)",
          borderWidth: 2,
          lineWidth: 2,
        },
      },
    },
  };

  if (!dataContext) return <div>No Data Found</div>;
  return (
    <div className={styles.lkeContentContainer}>
      <div className={styles.lkeContent}>
        <div className={styles.lkeContentHeader}>
          <div className={styles.breadcrumb}>
            <Link href={`/`} className="text-blue-700 font-semibold hover:text-green-600">
              Beranda
            </Link>{" "}
            <span>{" / "}</span>
            Lembar Kerja Evaluasi
          </div>

          <h1 className="leading-tight">{dataContext.evaluationName}</h1>
          <p className="text-sm my-2">
            Tentukan nilai untuk setiap kriteria sesuai dengan performa yang
            telah dicapai
          </p>
        </div>

        <div className={styles.fillguideMain}>
          <div className={`${styles.staticticAnswer} bg-white rounded-lg p-4 border px-4 duration-300 ease-in-out shadow-md`}>
            <strong className="text-gray-800 text-center">Progress Pengisisan Kriteria</strong>
            {criteriaStats.length > 0 ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <p className="text-center">Loading...</p>
            )}

            <strong className="mt-4">Jumlah Kriteria yang telah diisi</strong>
            <ol className="flex justify-around gap-5">
              {criteriaStats
                .sort((a, b) => a.componentNumber - b.componentNumber)
                .flatMap((stat) => {
                  return <li className="flex flex-col gap-1 p-2 rounded-lg shadow-md border border-gray-300">
                    <span className="font-medium text-gray-600">{stat.componentName}</span>
                    <span className="p-2 rounded-lg bg-blue-100 border border-blue-500">{`Terisi: ${stat.totalCriteria - stat.emptyCriteriaCount}/${stat.totalCriteria}`}</span>
                  </li>
                })}
            </ol>

          </div>

          <div className={styles.explainComponents}>
            <h5 className="font-bold">Deskripsi</h5>
            <p className="italic text-gray-600 font-normal">
              {dataContext.evaluationDesc !== "" ? dataContext.evaluationDesc : "Tidak ada deskripsi untuk LKE ini"}
            </p>

          </div>
        </div>

        <div className={styles.nextButton}>
          <Link
            href={`${dataContext.evaluationId}/instruction`}
            className="border border-blue-500 text-blue-500 rounded-md px-4 hover:bg-blue-500 hover:text-white transition-colors duration-300 ease-in-out shadow-md"
          >
            <button type="button">
              <p>Selanjutnya</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="45"
                height="45"
                viewBox="0 0 45 45"
                fill="none"
              >
                <title>Next</title>
                <rect width="45" height="45" rx="22.5" fill="#01499F" />
                <path
                  d="M19 30L26.5 22.5L19 15"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

