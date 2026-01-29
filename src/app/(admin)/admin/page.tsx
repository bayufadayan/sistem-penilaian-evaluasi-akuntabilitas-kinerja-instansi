'use client';
import React from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import CardCount from './cardCount';
import SmallCard from './smallCard';
import UserActivityChart from './userActivityChart';
import EvaluationPieChart from './evaluationPieChart';
import UserActivityTable from './userActivityTable';
import { MdOutlineAccountCircle } from "react-icons/md";
import { FaRegChartBar } from "react-icons/fa";
import { AiOutlineTeam } from "react-icons/ai";
import { ImFilesEmpty } from "react-icons/im";
import EvaluationScoreCompleted, { EvaluationScoreInProgress } from './lastEvaluationScore';
import EvaluationScoreTable from './evaluationScoreTable';
import ActivityTable from './activityTable';

type EvaluationStatusCount = {
  COMPLETED: number;
  IN_PROGRESS: number;
  PENDING: number;
  CANCELLED: number;
};

export default function TeamPage() {
  // SWR hooks untuk caching data
  const { data: userCountData } = useSWR('/api/users/count', fetcher);
  const { data: teamCountData } = useSWR('/api/teams/count', fetcher);
  const { data: evaluationCountData } = useSWR('/api/evaluations/count', fetcher);
  const { data: evidenceCountData } = useSWR('/api/evidence/count', fetcher);
  const { data: componentCountData } = useSWR('/api/components/count', fetcher);
  const { data: subComponentCountData } = useSWR('/api/subcomponents/count', fetcher);
  const { data: criteriaCountData } = useSWR('/api/criterias/count', fetcher);
  const { data: evaluationByStatusData } = useSWR('/api/evaluations/countbystatus', fetcher);

  const userCount = userCountData?.userCount || "";
  const teamCount = teamCountData?.teamCount || "";
  const evaluationCount = evaluationCountData?.evaluationSheetCount || "";
  const evidenceCount = evidenceCountData?.evidenceCount || "";
  const componentCount = componentCountData?.componentCount || "";
  const subComponentCount = subComponentCountData?.subComponentScoreCount || "";
  const criteriaCount = criteriaCountData?.criteriaCount || "";
  
  const evaluationByStatusCount: EvaluationStatusCount = {
    COMPLETED: evaluationByStatusData?.COMPLETED || 0,
    IN_PROGRESS: evaluationByStatusData?.IN_PROGRESS || 0,
    PENDING: evaluationByStatusData?.PENDING || 0,
    CANCELLED: evaluationByStatusData?.CANCELLED || 0,
  };

  const evidenceData = {
    labels: ['Completed', 'In Progress', 'Pending', 'Canceled'],
    datasets: [
      {
        label: 'LKE Berdasarkan status',
        data: [
          evaluationByStatusCount.COMPLETED || 0,
          evaluationByStatusCount.IN_PROGRESS || 0,
          evaluationByStatusCount.PENDING || 0,
          evaluationByStatusCount.CANCELLED || 0,
        ],
        backgroundColor: [
          'rgba(153, 102, 255, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(153, 102, 255, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };



  return (
    <div className="min-h-screen p-4">
      {/* Breadcrumb */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Dashboard Admin</h1>
      </div>

      <div className="flex gap-2 flex-col">
        <div className="flex gap-4 mb-6">
          <CardCount title="Jumlah Akun Terdaftar" value={userCount} color="from-red-600 to-red-400" icon={< MdOutlineAccountCircle className="text-white w-12 h-12" />} />
          <CardCount title="Jumlah Tim Terdaftar" value={teamCount} color="from-blue-600 to-blue-400" icon={< AiOutlineTeam className="text-white w-12 h-12" />} />
          <CardCount title="Jumlah LKE AKIP" value={evaluationCount} color="from-green-600 to-green-400" icon={< FaRegChartBar className="text-white w-12 h-12" />} />
          <CardCount title="Jumlah Evidence" value={evidenceCount} color="from-yellow-600 to-yellow-400" icon={<ImFilesEmpty className="text-white w-12 h-12" />} />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        <div className="bg-white flex-1 p-4 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <SmallCard title="Total Seluruh Komponen" value={componentCount} color="text-blue-600" borderColor="border-blue-600" />
            <SmallCard title="Total Seluruh Subkomponen" value={subComponentCount} color="text-green-600" borderColor="border-green-600" />
            <SmallCard title="Total Seluruh Kriteria" value={criteriaCount} color="text-yellow-600" borderColor="border-yellow-600" />
          </div>

          <div className="flex flex-col gap-4">
            {/* Evidence Pie Chart */}
            <div className="w-full flex gap-2 items-stretch">
              <div className="w-3/5 grid grid-cols-1">
                <EvaluationPieChart data={evidenceData} />
              </div>

              <div className="w-2/5 flex flex-col gap-2 min-h-full">
                <div className="bg-white p-4 rounded-lg shadow-md flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Nilai Akhir LKE AKIP <br />
                    <span className='text-blue-600'>In Progress</span> Terbaru
                  </h3>
                  <EvaluationScoreInProgress />
                  <div></div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Nilai Akhir LKE AKIP <span className='text-green-600'>Selesai</span> Terbaru
                  </h3>
                  <EvaluationScoreCompleted />
                  <div></div>
                </div>
              </div>
            </div>

            {/* User Activity Line Chart */}
            <div className="w-full">
              <UserActivityChart />
            </div>
          </div>

        </div>

        <div className="w-full md:w-1/4 flex flex-col gap-4">
          <UserActivityTable />
          <EvaluationScoreTable />
          <ActivityTable />
        </div>
      </div>
    </div>
  );
}