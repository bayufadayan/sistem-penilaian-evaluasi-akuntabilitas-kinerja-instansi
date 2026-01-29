'use client';
import React, { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import CardCount from './cardCount';
import SmallCard from './smallCard';
import UserActivityTable from './userActivityTable';
import { MdOutlineAccountCircle, MdTrendingUp } from "react-icons/md";
import { FaRegChartBar } from "react-icons/fa";
import { AiOutlineTeam } from "react-icons/ai";
import { ImFilesEmpty } from "react-icons/im";
import EvaluationScoreCompleted, { EvaluationScoreInProgress } from './lastEvaluationScore';
import EvaluationScoreTable from './evaluationScoreTable';
import ActivityTable from './activityTable';
import CardSkeleton from '@/components/skeletons/CardSkeleton';
import ChartSkeleton from '@/components/skeletons/ChartSkeleton';
import { 
  BarChart, Bar, AreaChart, Area, 
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

type EvaluationStatusCount = {
  COMPLETED: number;
  IN_PROGRESS: number;
  PENDING: number;
  CANCELLED: number;
};

type AnalyticsOverview = {
  overview: {
    totalTeams: number;
    totalEvaluations: number;
    totalUsers: number;
    totalEvidence: number;
    completionRate: number;
  };
  statusBreakdown: Array<{ status: string; count: number }>;
  teamPerformance: Array<{
    id: number;
    name: string;
    evaluationCount: number;
    componentCount: number;
    completedCount: number;
    inProgressCount: number;
  }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recentActivity: Array<any>;
};

type TrendsData = {
  monthly: Array<{
    month: string;
    evaluationCount: number;
    completedCount: number;
    completionRate: number;
  }>;
  componentPerformance: Array<{
    id: number;
    name: string;
    team: string;
    weight: number;
  }>;
};

export default function TeamPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('6');
  
  // SWR hooks untuk caching data
  const { data: userCountData, isLoading: isLoadingUsers } = useSWR('/api/users/count', fetcher);
  const { data: teamCountData, isLoading: isLoadingTeams } = useSWR('/api/teams/count', fetcher);
  const { data: evaluationCountData, isLoading: isLoadingEvaluations } = useSWR('/api/evaluations/count', fetcher);
  const { data: evidenceCountData, isLoading: isLoadingEvidence } = useSWR('/api/evidence/count', fetcher);
  const { data: componentCountData, isLoading: isLoadingComponents } = useSWR('/api/components/count', fetcher);
  const { data: subComponentCountData, isLoading: isLoadingSubComponents } = useSWR('/api/subcomponents/count', fetcher);
  const { data: criteriaCountData, isLoading: isLoadingCriterias } = useSWR('/api/criterias/count', fetcher);
  const { data: evaluationByStatusData, isLoading: isLoadingByStatus } = useSWR('/api/evaluations/countbystatus', fetcher);

  // New analytics endpoints
  const { data: analyticsOverview, isLoading: isLoadingOverview } = useSWR<AnalyticsOverview>('/api/analytics/overview', fetcher);
  const { data: trendsData, isLoading: isLoadingTrends } = useSWR<TrendsData>(`/api/analytics/trends?months=${selectedPeriod}`, fetcher);

  const isLoadingCounts = isLoadingUsers || isLoadingTeams || isLoadingEvaluations || isLoadingEvidence;
  const isLoadingStats = isLoadingComponents || isLoadingSubComponents || isLoadingCriterias;

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

  // Prepare pie chart data for status breakdown
  const statusPieData = [
    { name: 'Completed', value: evaluationByStatusCount.COMPLETED, color: '#10b981' },
    { name: 'In Progress', value: evaluationByStatusCount.IN_PROGRESS, color: '#3b82f6' },
    { name: 'Pending', value: evaluationByStatusCount.PENDING, color: '#f59e0b' },
    { name: 'Cancelled', value: evaluationByStatusCount.CANCELLED, color: '#ef4444' },
  ];

  // Prepare team comparison bar chart data
  const teamBarData = analyticsOverview?.teamPerformance.slice(0, 10).map(team => ({
    name: team.name.length > 15 ? team.name.substring(0, 15) + '...' : team.name,
    components: team.componentCount,
    completed: team.completedCount,
    inProgress: team.inProgressCount,
  })) || [];

  // Prepare trends line chart data
  const trendsLineData = trendsData?.monthly.map(item => ({
    month: item.month,
    count: item.evaluationCount,
    rate: item.completionRate,
  })) || [];

  // Prepare component performance radar data (use weight instead of score)
  const componentRadarData = trendsData?.componentPerformance.slice(0, 8).map(comp => ({
    component: comp.name.length > 20 ? comp.name.substring(0, 20) + '...' : comp.name,
    weight: Math.round(comp.weight * 100), // Convert to percentage
  })) || [];

  return (
    <div className="min-h-screen p-4">
      {/* Breadcrumb */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Dashboard Analytics</h1>
        <div className="flex gap-2">
          <select 
            className="select select-bordered select-sm"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="3">3 Bulan</option>
            <option value="6">6 Bulan</option>
            <option value="12">12 Bulan</option>
          </select>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="flex gap-2 flex-col">
        {isLoadingCounts ? (
          <CardSkeleton count={4} />
        ) : (
          <div className="flex gap-4 mb-6">
            <CardCount title="Jumlah Akun Terdaftar" value={userCount} color="from-red-600 to-red-400" icon={<MdOutlineAccountCircle className="text-white w-12 h-12" />} />
            <CardCount title="Jumlah Tim Terdaftar" value={teamCount} color="from-blue-600 to-blue-400" icon={<AiOutlineTeam className="text-white w-12 h-12" />} />
            <CardCount title="Jumlah LKE AKIP" value={evaluationCount} color="from-green-600 to-green-400" icon={<FaRegChartBar className="text-white w-12 h-12" />} />
            <CardCount title="Jumlah Evidence" value={evidenceCount} color="from-yellow-600 to-yellow-400" icon={<ImFilesEmpty className="text-white w-12 h-12" />} />
          </div>
        )}
      </div>

      {/* Analytics Summary Cards */}
      {!isLoadingOverview && analyticsOverview && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-800">{analyticsOverview.overview.completionRate}%</p>
              </div>
              <MdTrendingUp className="text-blue-500 w-8 h-8" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Teams</p>
                <p className="text-2xl font-bold text-gray-800">{analyticsOverview.overview.totalTeams}</p>
              </div>
              <AiOutlineTeam className="text-green-500 w-8 h-8" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Evaluations</p>
                <p className="text-2xl font-bold text-gray-800">{analyticsOverview.overview.totalEvaluations}</p>
              </div>
              <FaRegChartBar className="text-purple-500 w-8 h-8" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Evidence</p>
                <p className="text-2xl font-bold text-gray-800">{analyticsOverview.overview.totalEvidence}</p>
              </div>
              <ImFilesEmpty className="text-orange-500 w-8 h-8" />
            </div>
          </div>
        </div>
      )}

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Team Performance Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Performa Tim (Top 10)</h3>
          {isLoadingOverview ? (
            <ChartSkeleton />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={teamBarData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="components" fill="#3b82f6" name="Components" />
                <Bar dataKey="completed" fill="#10b981" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Status Distribution Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Status LKE AKIP</h3>
          {isLoadingByStatus ? (
            <ChartSkeleton />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Trends Line Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Tren Nilai & Completion Rate</h3>
          {isLoadingTrends ? (
            <ChartSkeleton />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendsLineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="count" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} name="Count" />
                <Area yAxisId="right" type="monotone" dataKey="rate" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Completion %" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Component Performance Radar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Performa per Komponen</h3>
          {isLoadingTrends ? (
            <ChartSkeleton />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={componentRadarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="component" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Component Weight" dataKey="weight" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Small Stats Cards */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        {isLoadingStats ? (
          <div className="mb-4">
            <CardSkeleton count={3} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <SmallCard title="Total Seluruh Komponen" value={componentCount} color="text-blue-600" borderColor="border-blue-600" />
            <SmallCard title="Total Seluruh Subkomponen" value={subComponentCount} color="text-green-600" borderColor="border-green-600" />
            <SmallCard title="Total Seluruh Kriteria" value={criteriaCount} color="text-yellow-600" borderColor="border-yellow-600" />
          </div>
        )}
      </div>

      {/* Bottom Section with Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Latest Scores Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Nilai Akhir LKE AKIP <span className='text-blue-600'>In Progress</span> Terbaru
              </h3>
              <EvaluationScoreInProgress />
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Nilai Akhir LKE AKIP <span className='text-green-600'>Selesai</span> Terbaru
              </h3>
              <EvaluationScoreCompleted />
            </div>
          </div>
        </div>

        {/* Side Tables */}
        <div className="space-y-4">
          <UserActivityTable />
          <EvaluationScoreTable />
          <ActivityTable />
        </div>
      </div>
    </div>
  );
}