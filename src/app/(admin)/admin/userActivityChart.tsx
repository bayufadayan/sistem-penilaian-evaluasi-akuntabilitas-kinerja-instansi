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
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/log-activity');
                const data = await response.json();
                console.log('Raw API data:', data); // Debug: periksa data dari API

                const groupedData = data.reduce((acc: any, item: any) => {
                    const date = new Date(item.createdAt);
                    const day = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`; // Format DD-MM-YYYY

                    if (!acc[day]) {
                        acc[day] = 0;
                    }
                    acc[day] += 1;
                    return acc;
                }, {});

                console.log('Grouped Data:', groupedData); // Debug: periksa hasil grouping
                setActivityData(groupedData);
                setFilteredData(groupedData);
            } catch (error) {
                console.error('Error fetching activity data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);


    // Filter berdasarkan bulan dan tahun
    useEffect(() => {
        const filterData = () => {
            console.log('Current Filters:', { monthFilter, yearFilter }); // Debug: Periksa filter yang diterapkan
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

            console.log('Filtered Data:', filtered); // Debug: Periksa hasil filter
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
                ticks: {
                    display: true,
                },
            },
            y: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                },
            },
        },
        interaction: {
            mode: 'nearest' as const,
            intersect: false,
        },
        hover: {
            mode: 'nearest' as const,
            intersect: false,
        },
        elements: {
            line: {
                borderWidth: 3,
            },
            point: {
                radius: 5,
                hoverRadius: 7,
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
                borderWidth: 2,
                tension: 0.2,
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
                    {Array.from({ length: new Date().getFullYear() - 2024 + 1 }, (_, i) => 2024 + i).map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>

            </div>

            {/* Chart */}
            <div className="h-64">
                {isLoading ? (
                    <p className="text-gray-500 text-center">Memuat data...</p>
                ) : Object.keys(filteredData).length > 0 ? (
                    <Line data={chartData} options={options} />
                ) : (
                    <p className="text-gray-500 text-center">Data tidak tersedia untuk bulan dan tahun yang dipilih.</p>
                )}
            </div>


        </div>
    );
}

export default UserActivityChart;
