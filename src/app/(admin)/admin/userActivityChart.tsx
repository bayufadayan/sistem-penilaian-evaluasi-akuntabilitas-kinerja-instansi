/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Registrasi Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function UserActivityChart() {
    const [activityData, setActivityData] = useState<any>([]);
    const [filteredData, setFilteredData] = useState<any>([]);
    const [monthFilter, setMonthFilter] = useState<string>('');
    const [yearFilter, setYearFilter] = useState<string>('');

    useEffect(() => {
        // Ambil data dari API
        const fetchData = async () => {
            try {
                const response = await fetch('/api/log-activity');
                const data = await response.json();
                console.log(data); // Tambahkan log ini untuk memeriksa data

                // Mengelompokkan data berdasarkan hari
                const groupedData = data.reduce((acc: any, item: any) => {
                    const date = new Date(item.createdAt);
                    const day = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`; // Format DD-MM-YYYY

                    if (!acc[day]) {
                        acc[day] = 0;
                    }
                    acc[day] += 1; // Menambahkan count untuk hari tersebut
                    return acc;
                }, {});

                // Menyimpan data dan menyiapkan chart
                setActivityData(groupedData);
                setFilteredData(groupedData);
            } catch (error) {
                console.error('Error fetching activity data:', error);
            }
        };

        fetchData();
    }, []);

    // Filter berdasarkan bulan dan tahun
    useEffect(() => {
        const filterData = () => {
            const filtered = Object.keys(activityData).filter((key) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const [day, month, year] = key.split('-');
                const matchesMonth = monthFilter ? month === monthFilter : true;
                const matchesYear = yearFilter ? year === yearFilter : true;
                return matchesMonth && matchesYear;
            }).reduce((acc: any, key) => {
                acc[key] = activityData[key];
                return acc;
            }, {});

            setFilteredData(filtered);
        };

        filterData();
    }, [monthFilter, yearFilter, activityData]);

    const options = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: (tooltipItem: any) => `Activity: ${tooltipItem.raw}`,
                },
            },
            legend: {
                display: false,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                },
            },
        },
    };

    // Prepare chart data
    const chartData = {
        labels: Object.keys(filteredData),
        datasets: [
            {
                label: 'Aktivitas Pengguna',
                data: Object.values(filteredData),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1,
            },
        ],
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Aktivitas Pengguna</h3>

            {/* Filter Form */}
            <div className="mb-4">
                <label className="mr-2">Bulan:</label>
                <select
                    value={monthFilter}
                    onChange={(e) => setMonthFilter(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="">Semua Bulan</option>
                    <option value="1">Januari</option>
                    <option value="2">Februari</option>
                    <option value="3">Maret</option>
                    <option value="4">April</option>
                    <option value="5">Mei</option>
                    <option value="6">Juni</option>
                    <option value="7">Juli</option>
                    <option value="8">Agustus</option>
                    <option value="9">September</option>
                    <option value="10">Oktober</option>
                    <option value="11">November</option>
                    <option value="12">Desember</option>
                </select>

                <label className="ml-4 mr-2">Tahun:</label>
                <select
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="">Semua Tahun</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                </select>
            </div>

            {/* Chart */}
            <div className="h-64">
                {filteredData && filteredData.length > 0 ? (
                    <Line data={chartData} options={options} />
                ) : (
                    <p>Loading data...</p>
                )}
            </div>
        </div>
    );
}

export default UserActivityChart;
