/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FiMoreHorizontal } from "react-icons/fi";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import EditScoreModal from "./editScoreModal";

export const PATCH = async (
    request: Request,
    { params }: { params: { id: string } }
) => {
    try {
        if (!params.id) {
            return NextResponse.json(
                { error: "ID is required" },
                { status: 400 }
            );
        }

        const body = await request.json();

        const updatedScore = await prisma.score.update({
            where: {
                id: Number(params.id),
            },
            data: {
                score: body.score,
            },
        });

        return NextResponse.json(updatedScore, { status: 200 });
    } catch (error) {
        console.error("Error updating score:", error);
        return NextResponse.json(
            { error: "Failed to update score" },
            { status: 500 }
        );
    }
};

export default function TableRow({ score,
    onScoreUpdate, }: {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        score: any;
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        onScoreUpdate: (updatedScore: any) => void;
    }) {
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const submenuRef = useRef<HTMLDivElement>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const router = useRouter();

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const handleEditSuccess = async(updatedScore: any) => {
        try {
            // Fetch data lengkap untuk score yang baru saja di-update
            const response = await fetch(`/api/score/${updatedScore.id}`);
            const fullUpdatedScore = await response.json();

            // Update state dengan data lengkap
            onScoreUpdate(fullUpdatedScore);
            setIsEditModalOpen(false);
            setIsSubmenuOpen(false)
        } catch (error) {
            console.error("Failed to fetch updated score:", error);
        }

    };

    const toggleSubmenu = () => {
        setIsSubmenuOpen(!isSubmenuOpen);
    };

    const closeSubmenu = useCallback((e: MouseEvent) => {
        if (submenuRef.current && !submenuRef.current.contains(e.target as Node)) {
            setIsSubmenuOpen(false);
        }
    }, []);

    useEffect(() => {
        if (isSubmenuOpen) {
            document.addEventListener("mousedown", closeSubmenu);
        } else {
            document.removeEventListener("mousedown", closeSubmenu);
        }

        return () => {
            document.removeEventListener("mousedown", closeSubmenu);
        };
    }, [isSubmenuOpen, closeSubmenu]);

    const handleModalToggle = () => {
        setIsModalOpen(!isModalOpen);
    };

    const [isLoading, setIsLoading] = useState(false);

    const handleDeleteScore = async () => {
        setIsLoading(true);

        try {
            console.log(`Menghapus nilai untuk Score ID: ${score.id}`);
            const response = await fetch(`/api/score/${score.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ score: '' }),
            });

            if (!response.ok) {
                throw new Error("Gagal menghapus nilai dari server.");
            }

            const updatedScore = await response.json();
            console.log("Nilai berhasil dihapus:", updatedScore);

            score.score = '';

            setIsModalOpen(false);
            setIsSubmenuOpen(false);
            router.refresh()
            // document.location.reload();
        } catch (error) {
            console.error("Gagal menghapus nilai:", error);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <td className="text-right relative">
            <div className="flex justify-center items-center">
                <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 hover:text-gray-700 focus:ring-2 focus:ring-gray-300 focus:outline-none"
                    onClick={toggleSubmenu}
                >
                    <FiMoreHorizontal />
                </button>
            </div>
            {isSubmenuOpen && (
                <div
                    ref={submenuRef}
                    className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                >
                    <ul className="py-1">
                        <li>
                            <button
                                type="button"
                                onClick={() => alert(`Detail for ${score.id}`)}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                                <span className="flex items-center gap-2">
                                    <IoMdInformationCircleOutline className="h-5 w-5 text-gray-700" />
                                    Detail
                                </span>
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                onClick={() => setIsEditModalOpen(true)}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                                <span className="flex items-center gap-2">
                                    <CiEdit className="h-5 w-5 text-gray-700" />
                                    Edit
                                </span>
                            </button>

                            {isEditModalOpen && (
                                <EditScoreModal
                                    score={score}
                                    onClose={() => setIsEditModalOpen(false)}
                                    onSuccess={handleEditSuccess}
                                    onDelete={handleDeleteScore}
                                />
                            )}
                        </li>
                        <li>
                            <button
                                type="button"
                                onClick={handleModalToggle}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                                <span className="flex items-center gap-2">
                                    <IoMdClose className="h-5 w-5 text-gray-700" />
                                    Hapus Nilai
                                </span>
                            </button>
                        </li>
                    </ul>
                </div>
            )}

            {isModalOpen && (
                <div
                    id="popup-modal"
                    tabIndex={-1}
                    className="fixed inset-0 z-50 flex items-center justify-center w-full h-screen bg-gray-900 bg-opacity-50"
                >
                    <div className="relative p-4 w-full max-w-md bg-white rounded-lg shadow dark:bg-gray-700">
                        <button
                            type="button"
                            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={handleModalToggle}
                        >
                            {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                            <svg
                                className="w-3 h-3"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 14 14"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6"
                                />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                        <div className="p-4 md:p-5 text-center">
                            {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                            <svg
                                className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />
                            </svg>
                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                Apakah Anda yakin ingin menghapus nilai untuk{" "}
                                <span className="inline-block bg-slate-800 text-slate-400 text-base font-semibold rounded-lg px-2 py-1 mx-1">
                                    {score.criteria?.name || "Kriteria"}
                                </span>
                                ?
                            </h3>
                            {isLoading ? (
                                <button
                                    type="button"
                                    disabled
                                    className="text-white bg-red-400 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                                >
                                    {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                                    <svg
                                        className="w-4 h-4 animate-spin mr-2"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v8z"
                                        />
                                    </svg>
                                    Menghapus...
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                                    onClick={handleDeleteScore}
                                >
                                    Ya, Saya yakin
                                </button>
                            )}
                            <button
                                type="button"
                                className="py-2.5 px-5 ml-3 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                onClick={handleModalToggle}
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </td>
    );
}
