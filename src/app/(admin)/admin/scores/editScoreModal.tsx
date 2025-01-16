/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import axios from "axios";

export default function EditScoreModal({
    score,
    onClose,
    onSuccess,
    onDelete,
    evidenceData,
    onAddEvidence,
    onDeleteEvidence,
    onDeleteSuccess,
}: {
    score: { id: number; score: string; notes: string };
    onClose: () => void;
    onSuccess: (updatedScore: any) => void;
    onDelete: () => void;
    evidenceData: any[];
    onAddEvidence: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    onDeleteEvidence: (evidenceId: number) => void;
    onDeleteSuccess: () => Promise<void>;
}) {
    const [newScore, setNewScore] = useState(score.score || "");
    const [newNotes, setNewNotes] = useState(score.notes || "");
    const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [fileIdToDelete, setFileIdToDelete] = useState<number | null>(null);
    const [fileNameToDelete, setFileNameToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");
    const [isToastVisible, setIsToastVisible] = useState(false);

    const handleUpdate = async () => {
        setIsLoading(true);
        try {
            const response = await axios.patch(`/api/score/${score.id}`, {
                score: newScore,
                notes: newNotes,
            });
            onSuccess(response.data);
            onClose();
        } catch (error) {
            console.error("Error updating score:", error);
            alert("Failed to update score.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        setIsDeleting(id);
        try {
            await axios.delete(`/api/evidence/${id}`);
            showToast("File berhasil dihapus!", "success");
            onDeleteSuccess();
            // fetchEvidence();
        } catch (error) {
            console.error("Error deleting file:", error);
            showToast(`Gagal menghapus file: ${error}`, "error");
        } finally {
            setIsDeleting(null);
        }
    };

    const showToast = (message: string, type: "success" | "error") => {
        setToastMessage(message);
        setToastType(type);
        setIsToastVisible(true);

        setTimeout(() => {
            setIsToastVisible(false);
        }, 3000);
    };

    const openModal = (id: number, name: string) => {
        setFileIdToDelete(id);
        setFileNameToDelete(name);
        const modal = document.getElementById("popup-modal");
        modal?.classList.remove("hidden");
        modal?.classList.add("flex");
    };

    const closeModal = () => {
        const modal = document.getElementById("popup-modal");
        modal?.classList.add("hidden");
    };

    const confirmDelete = () => {
        if (fileIdToDelete) {
            handleDelete(fileIdToDelete);
            closeModal();
        }
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center pl-40 gap-5 bg-gray-700 bg-opacity-50 z-50 transition-opacity duration-300 ease-in-out"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            {isToastVisible && (
                <div
                    className={`bottom-4 right-4 z-50 fixed flex items-center w-full max-w-xs p-4 mb-4 text-gray-700 bg-white rounded-lg shadow-lg border ${toastType === "success" ? "border-green-300" : "border-red-300"
                        } transition-all duration-500 ease-in-out transform ${isToastVisible ? "animate-slideIn" : "animate-slideOut"
                        }`}
                    // biome-ignore lint/a11y/useSemanticElements: <explanation>
                    role="alert"
                >
                    <div
                        className={`inline-flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full shadow-md ${toastType === "success"
                            ? "bg-green-100 text-green-500"
                            : "bg-red-100 text-red-500"
                            }`}
                    >
                        {toastType === "success" ? (
                            <FaCircleCheck className="text-green-600 text-2xl" />
                        ) : (
                            <svg
                                className="w-6 h-6"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
                            </svg>
                        )}
                    </div>
                    <div className="ml-3 text-sm font-medium">{toastMessage}</div>
                    <button
                        type="button"
                        className="ml-auto text-gray-400 hover:text-gray-900 focus:ring-2 focus:ring-red-300 p-1.5 rounded-lg bg-transparent hover:bg-gray-200 focus:bg-gray-100"
                        aria-label="Close"
                        onClick={() => setIsToastVisible(false)}
                    >
                        <svg
                            className="w-4 h-4"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 14"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                            />
                        </svg>
                    </button>
                </div>
            )}
            {/* Alert Hapus */}
            <div
                id="popup-modal"
                className="hidden fixed inset-0 z-[60] items-center justify-center bg-gray-600 bg-opacity-50 transition-all ease-in"
            >
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-lg font-semibold mb-4 text-black text-center">Konfirmasi Hapus</h2>
                    <p className="mb-4">Apakah kamu yakin ingin menghapus file <b>{fileNameToDelete}</b>?</p>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={confirmDelete}
                            className="bg-red-600 text-white px-4 py-2 rounded mr-2 hover:bg-red-700"
                        >
                            Ya, Saya Yakin
                        </button>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                        >
                            Batalkan
                        </button>
                    </div>
                </div>
            </div>

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
                                                onClick={() => openModal(evidence.id, evidence.file_name)}
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
                            {isDeleting && (
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 transition-transform duration-150"
                                    disabled
                                >
                                    <div className="flex items-center">
                                        <svg
                                            aria-hidden="true"
                                            className="w-6 h-6 text-gray-200 animate-spin dark:text-white-600 fill-red-400 mr-2"
                                            viewBox="0 0 100 101"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                fill="currentColor"
                                            />
                                            <path
                                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                fill="currentFill"
                                            />
                                        </svg>
                                        <span>Menghapus...</span>
                                    </div>
                                </button>
                            )}
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
