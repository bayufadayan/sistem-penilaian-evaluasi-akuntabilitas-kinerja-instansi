/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

// Registrasi Chart.js komponen
ChartJS.register(ArcElement, Tooltip, Legend, Title);

function EvaluationPieChart({ data }: { data: any }) {
    const options = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: (tooltipItem: any) => {
                        const total = data.datasets[0].data.reduce((sum: number, val: number) => sum + val, 0);
                        const value = tooltipItem.raw || 0;
                        const percentage = ((value / total) * 100).toFixed(2);
                        return `${tooltipItem.label}: ${value} (${percentage}%)`;
                    },
                },
            },
            legend: {
                position: 'bottom',
                labels: {
                    boxWidth: 15,
                    padding: 3,
                    color: '#333',
                    font: {
                        size: 12,
                    },
                },
            },
        },
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Jumlah LKE berdasarkan status</h3>
            <div className="flex justify-center items-center h-80">
                <Pie data={data} options={options} />
            </div>
        </div>
    );
}

export default EvaluationPieChart;
