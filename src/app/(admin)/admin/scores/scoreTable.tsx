"use client";
import React, { useState, useEffect } from "react";
import { FiExternalLink } from "react-icons/fi";
import { IoSearch } from "react-icons/io5";
import TableRow from "./tableRow";

type Score = {
    id: number;
    score: string;
    notes: string | null;
    created_at: string;
    evidence_count: number;
    criteria: {
        id: number;
        name: string;
    } | null;
    user: {
        id: number;
        name: string;
    } | null;
};

type Pagination = {
    totalRecords: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
};

export default function ScoreTable() {
    const [scores, setScores] = useState<Score[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        totalRecords: 0,
        totalPages: 1,
        currentPage: 1,
        pageSize: 10,
    });
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchScores(pagination.currentPage, pagination.pageSize, searchQuery);
        }, 500); // Debounce pencarian selama 500ms

        return () => clearTimeout(timeout);
    }, [searchQuery, pagination.currentPage, pagination.pageSize]);

    // Tambahkan default pada parameter agar lebih efisien
    const fetchScores = async (page = 1, limit = 10, query = "") => {
        setLoading(true);
        try {
            const response = await fetch(
                `/api/score?page=${page}&limit=${limit}&search=${encodeURIComponent(
                    query
                )}`
            );
            const result = await response.json();
            setScores(result.data); // Hindari pemberian type annotation berlebih
            setPagination(result.pagination); // Type diambil otomatis dari inisialisasi
        } catch (error) {
            console.error("Error fetching scores:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        setPagination((prev) => ({ ...prev, currentPage: newPage }));
    };

    const renderPagination = () => {
        const { totalPages, currentPage } = pagination;
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
                    Sebelumnya
                </button>
                {pageNumbers.map((page, index) =>
                    typeof page === "number" ? (
                        <button
                            type="button"
                            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                            key={index}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-2 rounded ${page === currentPage ? "bg-blue-500 text-white" : "bg-gray-200"
                                }`}
                        >
                            {page}
                        </button>
                    ) : (
                        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
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
                    Selanjutnya
                </button>
            </div>
        );
    };

    const handleScoreUpdate = (updatedScore: Score) => {
        fetchScores();
        setScores((prevScores) =>
            prevScores.map((score) =>
                score.id === updatedScore.id ? { ...score, ...updatedScore } : score
            )
        );
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <div className="relative flex items-center mb-4">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <IoSearch className="h-6 w-6" />{" "}
                </div>
                <input
                    type="text"
                    placeholder="Cari kriteria..."
                    className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="text-center">Loading...</div>
            ) : (
                <>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-500 border-b">
                                <th className="py-2 pe-4 text-left pl-4 w-[5%]">#</th>
                                <th className="py-2 pe-2 text-center w-[13%]">TANGGAL</th>
                                <th className="py-2 text-left w-[52%]">KRITERIA</th>
                                <th className="py-2 text-center w-[10%] gap-2">
                                    <span className="text-lg font-bold me-1">Σ</span>
                                    <span>EVIDENCE</span>
                                </th>
                                <th className="py-2 text-center w-[10%]">SCORE</th>
                                <th className="py-2 text-center w-[10%]">
                                    <div className="flex justify-center items-center">
                                        <FiExternalLink className="w-5 h-5 text-gray-600" />
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {scores.length > 0 ? (
                                scores.map((score, index) => (
                                    <tr key={score.id} className="border-b">
                                        <td className="py-4 text-center">
                                            {(pagination.currentPage - 1) * pagination.pageSize +
                                                index +
                                                1}
                                        </td>
                                        <td className="text-center pe-2">
                                            {new Date(score.created_at).toLocaleDateString("id-ID")}
                                        </td>
                                        <td className={`${score.score !== '' ? "text-black" : "text-red-500 transition-colors duration-300 animate-pulse"} py-2`}>
                                            {score.criteria?.name || "-"}
                                        </td>
                                        <td className="text-center">{score.evidence_count}</td>
                                        <td className="text-center">
                                            <span
                                                className={`p-2 rounded-lg text-white font-bold ${Number(score.score) >= 80
                                                    ? "bg-green-600"
                                                    : Number(score.score) >= 50
                                                        ? "bg-yellow-600"
                                                        : score.score === ''
                                                            ? "bg-gray-600" :
                                                            "bg-red-600"
                                                    }`}
                                            >
                                                {score.score !== "" ? score.score : 'N/A'}
                                            </span>

                                        </td>
                                        <TableRow score={score} onScoreUpdate={handleScoreUpdate} />
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="py-4 text-center text-gray-500">
                                        Data tidak ditemukan
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="mt-4">
                        {scores.length > 0 ? renderPagination() : ""}
                    </div>
                </>
            )}
        </div>
    );
}
