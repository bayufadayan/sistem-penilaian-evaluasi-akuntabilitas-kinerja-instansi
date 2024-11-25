import React from "react";
import styles from "@/styles/styles.module.css";

export default function DetailModal({
    details,
    isLoading,
    onClose,
}: {
    details: {
        LKE: string;
        Komponen: string;
        SubKomponen: string;
        Kriteria: string;
        Nilai: string;
        Notes: string;
        EvidenceCount: number;
        UserName: string;
        UserEmail: string;
    } | null; // Tambahkan null jika data belum tersedia
    isLoading: boolean; // Tambahkan prop untuk menentukan loading state
    onClose: () => void;
}) {
    const truncateText = (text: string, maxWords: number = 6): string => {
        const words = text.split(" ");
        if (words.length > maxWords) {
            return words.slice(0, maxWords).join(" ") + "...";
        }
        return text;
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 pl-52"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="bg-white rounded-lg shadow-lg p-6 w-[90vw] max-w-3xl h-[80vh] overflow-y-auto">
                {/* Loading State */}
                {isLoading ? (
                    <div className="text-center py-20">
                        <span className="text-gray-500 text-lg">Memuat data...</span>
                    </div>
                ) : details ? (
                    <>
                        {/* Jika data sudah ada, tampilkan detail */}
                        <h2 className="text-lg font-bold text-left">Detail Skor</h2>
                        <div className="flex flex-row text-gray-500 font-medium mb-4 gap-2">
                            Penilai Kriteria:{" "}
                            <span className="text-green-600">
                                {details.UserName} ({details.UserEmail})
                            </span>
                        </div>
                        <ul className="text-left space-y-4">
                            <li className="flex flex-col">
                                <strong>Lembar Kerja Evaluasi</strong>
                                <span className="text-blue-700 font-semibold text-xl">
                                    {details.LKE}
                                </span>
                            </li>
                            <div className="flex flex-row gap-4">
                                <li className="flex flex-col w-[50%]">
                                    <strong>Komponen:</strong>
                                    <span className="font-medium"> {details.Komponen}</span>
                                </li>
                                <li className="flex flex-col w-[50%]">
                                    <strong>Sub Komponen:</strong>
                                    <div className={`font-medium ${styles.tooltipContainer}`}>
                                        {truncateText(details.SubKomponen)}
                                        <div className={styles.tooltipText}>{details.SubKomponen}</div>
                                    </div>
                                </li>
                            </div>
                            <li className="flex flex-col mb-2">
                                <strong>Kriteria:</strong>
                                <span>{details.Kriteria}</span>
                            </li>
                            <li className="flex justify-between items-center bg-gray-100 border border-gray-300 rounded-lg p-4 shadow-sm">
                                <strong className="text-gray-700">Nilai:</strong>
                                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md font-medium shadow">
                                    {details.Nilai}
                                </span>
                            </li>
                            <li className="flex justify-between items-start bg-gray-100 border border-gray-300 rounded-lg p-4 shadow-sm">
                                <strong className="text-gray-700 mr-10">Notes:</strong>
                                <span className="bg-green-50 text-green-700 px-3 py-1 rounded-md font-medium shadow">
                                    {details.Notes}
                                </span>
                            </li>
                            <li className="flex justify-between items-center bg-gray-100 border border-gray-300 rounded-lg p-4 shadow-sm">
                                <strong className="text-gray-700">Jumlah Evidence:</strong>
                                <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-md font-medium shadow">
                                    {details.EvidenceCount}
                                </span>
                            </li>
                        </ul>
                        <div className="flex justify-end mt-4">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                onClick={onClose}
                            >
                                Tutup
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20">
                        <span className="text-gray-500 text-lg">Data tidak tersedia.</span>
                    </div>
                )}
            </div>
        </div>
    );
}
