"use client";
import React from "react";
import type { ComponentScore } from "@prisma/client";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type ComponentDetail = {
  id: number;
  name: string;
  description: string;
  weight: number;
  component_number: number;
  id_team: number;
  id_LKE: string;
  componentScore: ComponentScore[];
}

interface ComponentChartProps {
  components: ComponentDetail[];
}

export default function ComponentChart({ components }: ComponentChartProps) {
  const normalizedScores = components.map((component) => {
    const score = component.componentScore?.[0]?.nilai ?? 0;
    const weight = component.weight ?? 1;
    return (score / weight) * 100;
  });

  const remainingScores = normalizedScores.map((score) => 100 - score);

  const data = {
    labels: components.sort((a, b) => a.component_number - b.component_number)
      .map((component) => {
        const componentName = component.name.split(" ").map((word) => {
          return word.slice(0);
        });
        return componentName;
      }),
    datasets: [
      {
        label: "Skor Ternormalisasi (%)",
        data: normalizedScores,
        backgroundColor: "rgba(54, 162, 235, 0.7)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
        borderRadius: 8,
        barPercentage: 0.8,
        categoryPercentage: 0.5,
        stack: "Stack 0",
      },
      {
        label: "Sisa (%)",
        data: remainingScores,
        backgroundColor: "rgba(235, 52, 88, 0.5)",
        borderColor: "rgba(235, 52, 88, 1)",
        borderWidth: 2,
        borderRadius: 8,
        barPercentage: 0.8,
        categoryPercentage: 0.5,
        stack: "Stack 0",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Chart Skor Ternormalisasi Per Komponen',
        font: {
          size: 18,
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 10,
          callback: (value: number | string) => {
            return `${value}%`;
          },
        },
      },
      x: {
        stacked: true,
      },
    },
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <div style={{ height: "500px", width: "100%" }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
