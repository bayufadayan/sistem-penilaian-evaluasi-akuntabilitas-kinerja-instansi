"use client";

import React, { useState, useEffect, useCallback } from "react";
import styles from "@/styles/styles.module.css";
import { useSession } from "next-auth/react";
import { ActivityLog } from "@prisma/client";

type Pagination = {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
};

export default function HistoryPage() {
  const [logActivity, setLogActivity] = useState<ActivityLog[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    totalRecords: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: 5,
  });
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("Semua");
  const { data: session } = useSession();

  const fetchLogs = useCallback(
    async (page = 1, limit = 5, filter = "Semua") => {
      if (!session?.user?.id) return;

      setLoading(true);
      try {
        const res = await fetch(
          `/api/log-activity/${session.user.id}?page=${page}&limit=${limit}&filter=${filter}`
        );
        const result = await res.json();
        setLogActivity(Array.isArray(result.data) ? result.data : []);
        setPagination(result.pagination || {
          totalRecords: 0,
          totalPages: 1,
          currentPage: page,
          pageSize: limit,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setLogActivity([]); // Set to empty array on error
      } finally {
        setLoading(false);
      }
    },
    [session]
  );

  useEffect(() => {
    if (pagination.currentPage && pagination.pageSize) {
      const timeout = setTimeout(() => {
        fetchLogs(pagination.currentPage, pagination.pageSize, filter);
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [filter, pagination.currentPage, pagination.pageSize, fetchLogs]);

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  const renderPagination = () => {
    const { totalPages, currentPage } = pagination;
    if (!totalPages || !currentPage) return null;

    const pageNumbers: (number | string)[] = [];
    const maxVisiblePages = 3;

    if (totalPages <= maxVisiblePages + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      if (currentPage > maxVisiblePages) pageNumbers.push("...");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pageNumbers.push(i);
      }
      if (currentPage < totalPages - maxVisiblePages) pageNumbers.push("...");
      pageNumbers.push(totalPages);
    }

    return (
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        {pageNumbers.map((page, index) =>
          typeof page === "number" ? (
            <button
              key={index}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-2 rounded ${page === currentPage ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="px-3 py-2">
              {page}
            </span>
          )
        )}
        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <main className={`flex flex-col items-start p-6 min-h-[84vh] ${styles.mainContainer}`}>
      <div className="mt-10 w-full md:w-3/4">
        <h1 className="font-bold text-3xl pt-10 mb-5 text-black">Riwayat Aktivitas</h1>

        {/* Filter Buttons */}
        <div className="mb-4 flex justify-start space-x-2">
          {["Semua", "Hari Ini", "Minggu Ini", "Lebih lama"].map((label) => (
            <button
              key={label}
              onClick={() => setFilter(label)}
              className={`${filter === label
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
                } py-2 px-4 rounded-lg shadow hover:bg-blue-400 transition`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Activity Logs */}
        <div className="space-y-2">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : Array.isArray(logActivity) && logActivity.length === 0 ? (
            <p className="text-gray-500 ">Tidak ada data yang ditemukan.</p>
          ) : (
            logActivity.map((item, index) => (
              <div
                key={index}
                className="flex items-center bg-white border border-gray-200 rounded-lg shadow-md p-4 hover:shadow-lg transition"
              >
                <div className="flex items-center justify-center bg-gray-200 h-12 w-12 rounded-full mr-4">
                  <span className="text-gray-700 font-bold uppercase">
                    {item.actionType.charAt(0)}
                  </span>
                </div>
                <div className="flex flex-col flex-grow">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-800">
                      {item.actionType}
                    </h2>
                    <span className="text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    <p className="text-sm text-gray-500">
                      <b>{session?.user.name}</b> {" | "}
                      {new Date(item.createdAt).toLocaleDateString("id-ID", {
                        weekday: "long", 
                      })}
                      {", pukul "}
                      {new Date(item.createdAt).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit"
                      })}
                    </p>

                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="mt-6 text-black">{logActivity.length > 0 ? renderPagination() : ""}</div>
      </div>
    </main>
  );
}
