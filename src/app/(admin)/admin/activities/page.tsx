"use client"
import { TiHome } from "react-icons/ti";
import { IoIosArrowForward } from "react-icons/io";
import Link from "next/link";
import React, { useState } from 'react';
import { Helmet } from "react-helmet";
import { useDataContext } from "../../layout";
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import TableSkeleton from '@/components/skeletons/TableSkeleton';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface ActivityLog {
  id: number;
  actionType: string;
  tableName: string;
  recordId: number;
  id_users: number | null;
  createdAt: string;
  user: User | null;
}

export default function ActivityLogPage() {
  const dataContext = useDataContext();
  const [filterAction, setFilterAction] = useState<string>("all");
  const [filterTable, setFilterTable] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // SWR untuk caching dan auto-revalidation
  const { data: activities = [], isLoading } = useSWR<ActivityLog[]>('/api/log-activity', fetcher);

  // Filter activities
  const filteredActivities = activities.filter((activity) => {
    const matchesAction = filterAction === "all" || activity.actionType === filterAction;
    const matchesTable = filterTable === "all" || activity.tableName === filterTable;
    const matchesSearch = searchTerm === "" || 
      activity.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.user?.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesAction && matchesTable && matchesSearch;
  });

  // Get unique action types and table names for filters
  const actionTypes = Array.from(new Set(activities.map(a => a.actionType)));
  const tableNames = Array.from(new Set(activities.map(a => a.tableName)));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case "CREATE":
        return "badge-success";
      case "UPDATE":
        return "badge-info";
      case "DELETE":
        return "badge-error";
      default:
        return "badge-ghost";
    }
  };

  return (
    <>
      <Helmet>
        <title>Log Aktivitas | {dataContext?.appNameContext}</title>
        <meta name="description" content="Mengelola dan melihat riwayat aktivitas sistem" />
      </Helmet>
      <div>
        {/* Breadcrumb */}
        <div className="mb-4 text-gray-500 flex gap-1 items-start">
          <Link href="/admin" className="text-blue-600">
            <span className="flex gap-1">
              <TiHome className="mt-0.5" /> Dashboard
            </span>
          </Link>
          <IoIosArrowForward className="h-5 w-5" />
          Log Aktivitas
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Log Aktivitas Sistem</h1>
          <div className="badge badge-primary badge-lg">
            {filteredActivities.length} Aktivitas
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Cari Pengguna</span>
              </label>
              <input
                type="text"
                placeholder="Nama atau email..."
                className="input input-bordered w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Action Filter */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Filter Aksi</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
              >
                <option value="all">Semua Aksi</option>
                {actionTypes.map((action) => (
                  <option key={action} value={action}>
                    {action}
                  </option>
                ))}
              </select>
            </div>

            {/* Table Filter */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Filter Tabel</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={filterTable}
                onChange={(e) => setFilterTable(e.target.value)}
              >
                <option value="all">Semua Tabel</option>
                {tableNames.map((table) => (
                  <option key={table} value={table}>
                    {table}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reset Filters */}
          {(filterAction !== "all" || filterTable !== "all" || searchTerm !== "") && (
            <div className="mt-4">
              <button
                onClick={() => {
                  setFilterAction("all");
                  setFilterTable("all");
                  setSearchTerm("");
                }}
                className="btn btn-ghost btn-sm"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>

        {/* Tabel Konten */}
        <div className="bg-white shadow-md rounded-lg p-6">
          {isLoading ? (
            <TableSkeleton rows={10} columns={5} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-500 border-b">
                    <th className="py-2">#</th>
                    <th className="py-2">Tanggal & Waktu</th>
                    <th className="py-2">Pengguna</th>
                    <th className="py-2">Aksi</th>
                    <th className="py-2">Tabel</th>
                    <th className="py-2">Record ID</th>
                  </tr>
                </thead>
                {filteredActivities.length > 0 ? (
                  <tbody>
                    {filteredActivities.map((activity, index) => (
                      <tr className="border-b hover:bg-gray-50" key={activity.id}>
                        <td className="py-4">{index + 1}</td>
                        <td className="py-4 text-sm">
                          {formatDate(activity.createdAt)}
                        </td>
                        <td className="py-4">
                          <div>
                            <p className="font-semibold text-gray-800">
                              {activity.user?.name || "Sistem"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {activity.user?.email || "-"}
                            </p>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className={`badge ${getActionBadgeColor(activity.actionType)}`}>
                            {activity.actionType}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className="badge badge-outline">
                            {activity.tableName}
                          </span>
                        </td>
                        <td className="py-4 text-gray-600">
                          #{activity.recordId}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                ) : (
                  <tbody>
                    <tr>
                      <td colSpan={6} className="text-center py-8">
                        <p className="text-gray-500">
                          {searchTerm || filterAction !== "all" || filterTable !== "all"
                            ? "Tidak ada aktivitas yang sesuai dengan filter"
                            : "Belum ada aktivitas tercatat"}
                        </p>
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </div>
          )}
        </div>

        {/* Info Footer */}
        <div className="mt-4 text-sm text-gray-500">
          <p>
            💡 <span className="font-semibold">Info:</span> Log aktivitas mencatat semua perubahan data dalam sistem untuk keperluan audit dan keamanan.
          </p>
        </div>
      </div>
    </>
  );
}
