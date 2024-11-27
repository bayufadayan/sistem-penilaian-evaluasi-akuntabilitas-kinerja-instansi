"use client"
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { MdAutoAwesome } from "react-icons/md";

function GenerateTemplateButton() {
    const [loading, setLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("");
    const [showToast, setShowToast] = useState(false);
    const router = useRouter();

    const handleGenerate = async () => {
        setLoading(true);
        setShowToast(false);
        setToastMessage("");

        try {
            const response = await fetch("/api/generate-template", {
                method: "POST",
            });

            if (response.ok) {
                setToastMessage("Template berhasil dibuat!");
                setToastType("success");
            } else {
                const errorData = await response.json();
                setToastMessage(`Gagal membuat template: ${errorData.error || "Unknown error"}`);
                setToastType("error");
            }

            router.push(`/admin/evaluations?timestamp=${new Date().getTime()}`);
        } catch (error) {
            console.error("Error:", error);
            setToastMessage("Terjadi kesalahan saat memproses permintaan.");
            setToastType("error");
        } finally {
            setLoading(false);
            setShowToast(true);

            // Sembunyikan toast otomatis setelah 3 detik
            setTimeout(() => setShowToast(false), 3000);
        }
    };

    return (
        <div className="generate-template">
            <button
                onClick={handleGenerate}
                disabled={loading}
                className={`font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 flex gap-2 items-center generate-button bg-blue-600 text-white ${loading ? "opacity-75 cursor-not-allowed" : ""}`}
            >
                <MdAutoAwesome className="h-6" /> {loading ? "Loading..." : "Auto Generate"}
            </button>

            {/* Toast Notification */}
            {showToast && (
                <div
                    className={`fixed right-4 top-20 z-20 flex items-center w-full max-w-xs p-4 text-gray-700 bg-white rounded-lg shadow-lg border transition-all duration-500 ease-in-out transform ${showToast ? "animate-slideIn" : "animate-slideOut"
                        } ${toastType === "success" ? "border-green-300" : "border-red-300"}`}
                    role="alert"
                >
                    <div
                        className={`inline-flex items-center justify-center flex-shrink-0 w-10 h-10 ${toastType === "success"
                            ? "text-green-500 bg-green-100"
                            : "text-red-500 bg-red-100"
                            } rounded-full shadow-md`}
                    >
                        {toastType === "success" ? (
                            <svg
                                className="w-6 h-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M16.707 5.293a1 1 0 0 1 0 1.414l-8.5 8.5a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414l3.293 3.293 7.793-7.793a1 1 0 0 1 1.414 0Z" />
                            </svg>
                        ) : (
                            <svg
                                className="w-6 h-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
                            </svg>
                        )}
                        <span className="sr-only">{toastType === "success" ? "Success icon" : "Error icon"}</span>
                    </div>
                    <div className="ml-3 text-sm font-medium">
                        {toastMessage}
                    </div>
                    <button
                        type="button"
                        className="ml-auto text-gray-400 hover:text-gray-900 focus:ring-2 focus:ring-gray-300 p-1.5 rounded-lg bg-transparent hover:bg-gray-200 focus:bg-gray-100"
                        aria-label="Close"
                        onClick={() => setShowToast(false)}
                    >
                        <span className="sr-only">Close</span>
                        <svg
                            className="w-4 h-4"
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
                    </button>
                </div>
            )}
        </div>
    );
}

export default GenerateTemplateButton;
