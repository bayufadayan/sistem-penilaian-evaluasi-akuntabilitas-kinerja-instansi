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
import type { User } from "@prisma/client";

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
  team: Team;
}

interface Team {
  id: number;
  name: string;
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
  const [components, setComponents] = useState<Component[]>([]);
  const [users, setUsers] = useState<User[]>([]);
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

      const components = data.components.map((component: Component) => ({
        id: component.id,
        name: component.name,
        description: component.description,
        weight: component.weight,
        component_number: component.component_number,
        id_team: component.id_team,
        id_LKE: component.id_LKE,
        componentScore: component.componentScore,
        subComponents: component.subComponents,
        team: component.team,
      }));

      setComponents(components);
      setCriteriaStats(stats);
    };

    fetchCriteriaCount();
  }, [dataContext]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

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
              {dataContext.evaluationDesc !== "" ? dataContext.evaluationDesc : "Tidak ada deskripsi khusus untuk LKE ini"}
            </p>

            <h5 className="font-bold mt-4">Tim Pengisi</h5>
            <ol className="list-decimal pl-6">
              {components
                .sort((a, b) => a.component_number - b.component_number)
                .flatMap((component) => {
                  return (
                    <li className="relative mb-4 bg-white text-black shadow-md rounded-lg p-2">
                      <div>
                        <b>{component.name}</b>
                      </div>
                      <ul className="pl-6">
                        <li className="relative pl-4 flex flex-col">
                          Diisi Oleh:
                          <span className="font-bold bg-blue-600 text-white p-2 rounded-lg shadow-md w-fit">Tim {component.team.name}</span>
                          <ul className="list-disc pl-6">
                            {users.filter(user => user.id_team === component.id_team).length === 0 ? (
                              <li className="text-gray-500">Belum ada anggota</li>
                            ) : (
                              users.map((user) => {
                                if (user.id_team === component.id_team) {
                                  return (
                                    <li key={user.id} className="relative flex items-center my-1">
                                      <div className="absolute top-0 left-[-1rem] w-[2px] h-full bg-black opacity-40"></div>
                                      <div className="absolute top-2 left-[-21px] w-3 h-3 bg-white rounded-full border-2 border-gray-500"></div>

                                      <span className="ml-2">{user.name}</span>
                                    </li>
                                  );
                                }
                                return null;
                              })
                            )}
                          </ul>
                        </li>
                      </ul>
                    </li>
                  );
                })}
            </ol>


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

