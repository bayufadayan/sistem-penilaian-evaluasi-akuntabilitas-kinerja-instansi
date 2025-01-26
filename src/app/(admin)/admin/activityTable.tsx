import React, { useEffect, useState } from 'react';
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

interface Activity {
    id: number;
    actionType: string;
    tableName: string;
    recordId: number;
    id_users: number;
    createdAt: string;
}

function ActivityTable() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [activitiesPerPage] = useState(5);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await fetch("/api/log-activity");
                if (!response.ok) {
                    throw new Error("Failed to fetch activities");
                }
                const data = await response.json();
                // Urutkan data berdasarkan createdAt (terbaru di atas)
                data.sort((a: Activity, b: Activity) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setActivities(data);
            } catch (error) {
                console.error("Failed to fetch activities:", error);
            }
        };

        fetchActivities();
    }, []);

    // Logika pagination
    const indexOfLastActivity = currentPage * activitiesPerPage;
    const indexOfFirstActivity = indexOfLastActivity - activitiesPerPage;
    const currentActivities = activities.slice(indexOfFirstActivity, indexOfLastActivity);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="w-full bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800">Aktivitas Terbaru</h3>
            <div className="overflow-x-auto mt-4">
                <table className="min-w-[270px] text-sm text-left text-gray-500">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-1 py-2 min-w-fit text-left">#</th>
                            <th className="px-2 py-2 max-w-3 text-left">Tanggal</th>
                            <th className="px-2 py-2 min-w-[40%] text-left">Action Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentActivities.length !== 0 ? (
                            currentActivities.map((activity, index) => (
                                <tr key={activity.id}>
                                    <td className="px-1 py-2 align-top">{index + 1 + (currentPage - 1) * activitiesPerPage}</td>
                                    <td className="px-2 py-2 max-w-[100px] flex flex-wrap">{new Date(activity.createdAt).toLocaleString()}</td>
                                    <td className="px-2 py-2">{activity.actionType}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="px-4 py-2">Tidak ada Data</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-4 ">
                <button
                    onClick={() => paginate(currentPage - 1)}
                    className="px-4 py-1 mx-2 bg-white border-2 rounded-full border-gray-500 hover:bg-gray-200"
                    disabled={currentPage === 1}
                >
                    <FiArrowLeft className='w-5 h-5'/>
                </button>
                <button
                    onClick={() => paginate(currentPage + 1)}
                    className="px-4 py-1 mx-2 bg-white border-2 rounded-full border-gray-500 hover:bg-gray-200"
                    disabled={indexOfLastActivity >= activities.length}
                >
                    <FiArrowRight className='w-5 h-5'/>
                </button>
            </div>
        </div>
    );
}

export default ActivityTable;
