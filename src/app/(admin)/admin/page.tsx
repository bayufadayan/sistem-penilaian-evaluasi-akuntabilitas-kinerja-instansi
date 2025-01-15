'use client';
import React, { useEffect, useState } from 'react';
import CardCount from './cardCount';
import SmallCard from './smallCard';
import UserActivityChart from './userActivityChart';
import EvaluationPieChart from './evaluationPieChart';
import UserActivityTable from './userActivityTable';
import { MdOutlineAccountCircle } from "react-icons/md";
import { FaRegChartBar } from "react-icons/fa";
import { AiOutlineTeam } from "react-icons/ai";
import { ImFilesEmpty } from "react-icons/im";
import EvaluationScore from './lastEvaluationScore';

type EvaluationStatusCount = {
  COMPLETED: number;
  IN_PROGRESS: number;
  PENDING: number;
  CANCELLED: number;
};

export default function TeamPage() {

  const [userCount, setUserCount] = useState("");
  const [teamCount, setTeamCount] = useState("");
  const [evaluationCount, setEvaluationCount] = useState("");
  const [evidenceCount, setEvidenceCount] = useState("");
  const [componentCount, setComponentCount] = useState("");
  const [subComponentCount, setSubComponentCount] = useState("");
  const [criteriaCount, setCriteriaCount] = useState("");
  const [evaluationByStatusCount, setEvaluationByStatusCount] = useState<EvaluationStatusCount>({
    COMPLETED: 0,
    IN_PROGRESS: 0,
    PENDING: 0,
    CANCELLED: 0,
  });


  useEffect(() => {
    const fetchCount = async () => {
      try {
        const [userRes, teamRes, evaluationRes, evidenceRes] = await Promise.all([
          fetch("/api/users/count"),
          fetch("/api/teams/count"),
          fetch("/api/evaluations/count"),
          fetch("/api/evidence/count")
        ]);

        if (!userRes.ok || !teamRes.ok || !evaluationRes.ok || !evidenceRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const userCountData = await userRes.json();
        const teamCountData = await teamRes.json();
        const evaluationCountData = await evaluationRes.json();
        const evidenceCountData = await evidenceRes.json();

        setUserCount(userCountData.userCount);
        setTeamCount(teamCountData.teamCount);
        setEvaluationCount(evaluationCountData.evaluationSheetCount);
        setEvidenceCount(evidenceCountData.evidenceCount);
      } catch (error) {
        console.error("Failed to fetch counts:", error);
      }
    };

    fetchCount();
  }, []);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const [componentRes, subComponentRes, criteriaRes] = await Promise.all([
          fetch("/api/components/count"),
          fetch("/api/subcomponents/count"),
          fetch("/api/criterias/count"),
        ]);

        if (!componentRes.ok || !subComponentRes.ok || !criteriaRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const componentCountData = await componentRes.json();
        const subComponentCountData = await subComponentRes.json();
        const criteriaCountData = await criteriaRes.json();

        setComponentCount(componentCountData.componentCount);
        setSubComponentCount(subComponentCountData.subComponentScoreCount);
        setCriteriaCount(criteriaCountData.criteriaCount);
      } catch (error) {
        console.error("Failed to fetch counts:", error);
      }
    };

    fetchCount();
  }, []);

  const userActivityData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'User  Activity',
        data: [50, 100, 80, 120, 90],
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  };

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch("/api/evaluations/countbystatus");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const evaluationCountStatusData = await response.json();
        setEvaluationByStatusCount((prevState) => ({
          ...prevState,
          ...evaluationCountStatusData, // Merge existing with new data
        }));

      } catch (error) {
        console.error("Failed to fetch counts:", error);
      }
    };

    fetchCount();
  }, []);

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

      <div className="flex flex-col md:flex-row gap-8">
        <div className="bg-white flex-1 p-4 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <SmallCard title="Total Seluruh Komponen" value={componentCount} color="text-blue-600" borderColor="border-blue-600" />
            <SmallCard title="Total Seluruh Subkomponen" value={subComponentCount} color="text-green-600" borderColor="border-green-600" />
            <SmallCard title="Total Seluruh Kriteria" value={criteriaCount} color="text-yellow-600" borderColor="border-yellow-600" />
          </div>

          <div className="flex flex-col gap-4">
            {/* Evidence Pie Chart */}
            <div className="w-full flex gap-2">
              <div className="w-3/5">
                <EvaluationPieChart data={evidenceData} />
              </div>

              <div className="w-2/5 flex flex-col gap-2">
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Hasil LKE Terkini</h3>
                  <EvaluationScore />
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Nilai Komponen [LKE 2024]</h3>
                  <div>Content</div>
                </div>
              </div>
            </div>
            {/* User Activity Line Chart */}
            <div className="w-full">
              <UserActivityChart data={userActivityData} />
            </div>
          </div>

        </div>

        <div className="w-full md:w-1/4">
          <UserActivityTable />
        </div>
      </div>
    </div>
  );
}