/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import axios from "axios";

export default function EditScoreModal({
    score,
    onClose,
    onSuccess,
    onDelete,
    evidenceData,
    onAddEvidence,
    onDeleteEvidence,
}: {
    score: { id: number; score: string; notes: string };
    onClose: () => void;
    onSuccess: (updatedScore: any) => void;
    onDelete: () => void;
    evidenceData: any[];
    onAddEvidence: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    onDeleteEvidence: (evidenceId: number) => void;
}) {
    const [newScore, setNewScore] = useState(score.score || "");
    const [newNotes, setNewNotes] = useState(score.notes || "");
    const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdate = async () => {
        setIsLoading(true);
        try {
            const response = await axios.patch(`/api/score/${score.id}`, {
                score: newScore,
                notes: newNotes,
            });
            onSuccess(response.data); // Pass updated score back to the parent
            onClose(); // Close the modal
        } catch (error) {
            console.error("Error updating score:", error);
            alert("Failed to update score.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center pl-40 gap-5 bg-gray-700 bg-opacity-50 z-50 transition-opacity duration-300 ease-in-out"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full transform transition-transform duration-300 ease-in-out">
                <h2 className="text-lg font-bold mb-4 text-left">Edit Score</h2>
                {/* Input Score */}
                <div className="mb-4">
                    <label className="text-sm font-medium mb-2 text-left flex justify-between">
                        <span className="text-gray-700">Nilai</span>
                        <span
                            className="text-red-600 cursor-pointer hover:bg-red-500 hover:text-white px-2 rounded"
                            onClick={onDelete}
                        >
                            Hapus nilai
                        </span>
                    </label>
                    <ul className="grid grid-cols-4 gap-2 h-fit bg-gray-50">
                        {["100", "90", "80", "70", "60", "50", "30", "0"].map((value) => (
                            <li key={value}>
                                <input
                                    type="radio"
                                    name="score"
                                    id={`score${value}`}
                                    value={value}
                                    className="hidden peer"
                                    checked={newScore === value}
                                    onChange={() => setNewScore(value)}
                                />
                                <label
                                    htmlFor={`score${value}`}
                                    className={`${Number(value) >= 80
                                        ? "peer-checked:bg-green-600 hover:bg-green-200 hover:text-green-800"
                                        : Number(value) >= 50
                                            ? "peer-checked:bg-yellow-600 hover:bg-yellow-200 hover:text-yellow-800"
                                            : "peer-checked:bg-red-600 hover:bg-red-200 hover:text-red-800"
                                        } peer-checked:text-white px-4 py-2 rounded-lg border border-gray-300 text-center cursor-pointer block`}
                                >
                                    {value}
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Input Notes */}
                <div className="mb-4">
                    <label
                        className="block text-sm font-medium text-gray-700 mb-2 text-left"
                        htmlFor="notes"
                    >
                        Catatan
                    </label>
                    <textarea
                        id="notes"
                        name="notes"
                        placeholder="Catatan masih kosong, silakan tulis sesuatu"
                        value={newNotes}
                        onChange={(e) => setNewNotes(e.target.value)}
                        className="w-full border border-gray-400 rounded p-2 text-left focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                {/* Evidence List */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                        Daftar Evidence
                    </label>
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 mb-2 ">
                            <span className="font-semibold text-3xl">
                                {
                                    evidenceData.filter((evidence) => evidence.id_score === score.id)
                                        .length
                                } Evidence
                            </span>
                        </p>
                        <button
                            type="button"
                            onClick={() => setIsEvidenceModalOpen(true)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                        >
                            Lihat Daftar Evidence
                        </button>
                    </div>
                </div>
                {/* Action Buttons */}
                <hr className="opacity-50" />
                <div className="flex justify-end gap-2 mt-5">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleUpdate}
                        disabled={isLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                        {isLoading ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
            {isEvidenceModalOpen && (
                <div
                    className="justify-center right-4 inset-0 flex items-start bg-opacity-50 z-50 transform transition-transform duration-300 ease-in-out"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setIsEvidenceModalOpen(false);
                    }}
                >
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                        <div className="flex justify-between items-center pb-2 gap-3">
                            <h2 className="text-xl font-bold text-left text-black">
                                Daftar Evidence
                            </h2>
                            <input
                                id="hiddenFileInput"
                                type="file"
                                style={{ display: "none" }}
                                onChange={onAddEvidence}
                            />

                            <button
                                type="button"
                                onClick={() => document.getElementById("hiddenFileInput")?.click()}
                                className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 active:scale-95 active:shadow-inner transition-transform duration-150"
                            >
                                {isLoading ? "Loading" : "+ Tambah Evidence"}
                            </button>
                        </div>
                        <div className="mt-4">
                            {(() => {
                                const filteredEvidence = evidenceData.filter(
                                    (evidence) => evidence.id_score === score.id
                                );

                                if (filteredEvidence.length > 0) {
                                    return filteredEvidence.map((evidence) => (
                                        <div
                                            key={evidence.id}
                                            className="flex justify-between items-center bg-gray-100 p-3 rounded-md shadow mb-3 gap-2"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-blue-100 flex items-center justify-center rounded">
                                                    {/* Ikon file berdasarkan tipe */}
                                                    <svg
                                                        className="w-6 h-6 text-blue-600"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M3 3h18M9 3v18M15 3v18"
                                                        />
                                                    </svg>
                                                </div>
                                                <div className="flex flex-col text-left">
                                                    <a
                                                        href={evidence.public_path}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline font-semibold truncate block max-w-[250px] overflow-hidden"
                                                        title={evidence.file_name}
                                                    >
                                                        {evidence.file_name}
                                                    </a>

                                                    <p className="text-sm text-gray-500">
                                                        {(evidence.file_size / 1024).toFixed(2)} KB
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => onDeleteEvidence(evidence.id)}
                                                className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-500 transition-colors duration-150"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    ));
                                } else {
                                    return (
                                        <p className="text-gray-500 text-sm text-center">
                                            Tidak ada evidence yang tersedia.
                                        </p>
                                    );
                                }
                            })()}
                        </div>



                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                type="button"
                                onClick={() => setIsEvidenceModalOpen(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
