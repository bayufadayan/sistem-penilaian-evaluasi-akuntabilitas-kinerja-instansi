/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import axios from "axios";

export default function EditScoreModal({
    score,
    onClose,
    onSuccess,
    onDelete,
}: {
    score: { id: number; score: string; notes: string };
    onClose: () => void;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    onSuccess: (updatedScore: any) => void;
    onDelete: () => void;
}) {
    const [newScore, setNewScore] = useState(score.score || "");
    const [newNotes, setNewNotes] = useState(score.notes || "");
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return;

        try {
            const formData = new FormData();
            formData.append("file", file);
            await axios.post(`/api/evidence/${score.id}`, formData);
            alert("Evidence uploaded successfully!");
        } catch (error) {
            console.error("Error uploading evidence:", error);
            alert("Failed to upload evidence.");
        }
    };

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
        // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
        <div
            className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                <h2 className="text-lg font-bold mb-4 text-left">Edit Score</h2>{" "}
                {/* Judul rata kiri */}
                {/* Input Score */}
                <div className="mb-4">
                    <label
                        className="text-sm font-medium mb-2 text-left flex justify-between"
                        htmlFor=""
                    >
                        <span className="text-gray-700">Nilai</span>
                        {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
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
                        value={newNotes}
                        onChange={(e) => setNewNotes(e.target.value)}
                        className="w-full border border-gray-400 rounded p-2 text-left focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                {/* Upload Evidence */}
                <div className="mb-4">
                    <label
                        className="block text-sm font-medium text-gray-700 mb-2 text-left"
                        htmlFor="evidence"
                    >
                        Upload Evidence
                    </label>
                    <input
                        id="evidence"
                        type="file"
                        onChange={handleFileChange}
                        className="text-left"
                    />
                    <button
                        type="button"
                        onClick={handleUpload}
                        className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg"
                    >
                        Upload
                    </button>
                </div>
                {/* Action Buttons */}
                <div className="flex justify-end gap-2">
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
        </div>
    );
}
