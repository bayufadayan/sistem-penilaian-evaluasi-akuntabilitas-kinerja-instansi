"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FiExternalLink } from "react-icons/fi";

const Modal = ({ message, isSuccess, onClose }: { message: string; isSuccess: boolean; onClose: () => void }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
                <h2 className={`text-lg font-semibold mb-4 ${isSuccess ? "text-green-600" : "text-red-600"}`}>
                    {isSuccess ? "Success" : "Error"}
                </h2>
                <p className="text-gray-700">{message}</p>
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

const AdminSettingPage = () => {
    const [settings, setSettings] = useState({
        appName: "",
        appLogoLogin: "",
        appLogoDashboard: "",
        favicon: "",
        adminEmail: "",
        adminMailPass: "",
        adminPhone: "",
        guideLink: "",
    });
    const [isLoading, setisLoading] = useState(false);
    const [modal, setModal] = useState<{ isOpen: boolean; message: string; isSuccess: boolean }>({
        isOpen: false,
        message: "",
        isSuccess: true,
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    // Fetch settings from the API
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setisLoading(true);
                const response = await fetch("/api/settings");
                const data = await response.json();
                setSettings(data);
                setisLoading(false);
            } catch (error) {
                console.error("Failed to fetch settings:", error);
            }
        };

        fetchSettings();
    }, []);

    const handleSave = async () => {
        try {
            setisLoading(true);
            const response = await fetch("/api/settings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(settings),
            });
            const result = await response.json();
            setisLoading(false);

            setModal({
                isOpen: true,
                message: "Settings saved successfully!",
                isSuccess: true,
            });

            console.log("Saved settings:", result);
        } catch (error) {
            setisLoading(false);
            console.error("Failed to save settings:", error);

            setModal({
                isOpen: true,
                message: "Failed to save settings. Please try again.",
                isSuccess: false,
            });
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-gray-50 shadow-md rounded-lg">
            {isLoading && (
                <div className="fixed inset-0 bg-opacity-75 flex items-center justify-center z-50 bg-black">
                    <div className="text-center">
                        <svg
                            aria-hidden="true"
                            // biome-ignore lint/a11y/useSemanticElements: <explanation>
                            role="status"
                            className="inline w-4 h-4 me-3 text-white animate-spin"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="#E5E7EB"
                            />
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentColor"
                            />
                        </svg>
                        <p className="mt-4 text-white text-lg">Sedang mengambil data...</p>
                    </div>
                </div>
            )}

            <h1 className="text-2xl font-bold mb-6 text-gray-800">Admin Settings</h1>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nama Aplikasi</label>
                    <input
                        required
                        type="text"
                        name="appName"
                        value={settings.appName}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Logo Login (URL)</label>
                    <input
                        required
                        type="text"
                        name="appLogoLogin"
                        value={settings.appLogoLogin}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Logo Dashboard (URL)</label>
                    <input
                        required
                        type="text"
                        name="appLogoDashboard"
                        value={settings.appLogoDashboard}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Favicon (URL)</label>
                    <input
                        required
                        type="text"
                        name="favicon"
                        value={settings.favicon}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email Admin</label>
                    <input
                        required
                        type="email"
                        name="adminEmail"
                        value={settings.adminEmail}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Password Email</label>
                    <div className="relative mt-1">
                        <input
                            required
                            type={showPassword ? "text" : "password"}
                            name="adminMailPass"
                            value={settings.adminMailPass}
                            onChange={handleChange}
                            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nomor Admin</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            name="pemanis"
                            value={"+62"}
                            onChange={handleChange}
                            disabled={true}
                            className="mt-1 font-bold block p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500 focus:outline-none max-w-12"
                        />

                        <input
                            required
                            type="number"
                            name="adminPhone"
                            value={settings.adminPhone}
                            placeholder="8123456789"
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Link Panduan (Google Drive)</label>
                    <div className="relative mt-1">
                        <input
                            required
                            type="text"
                            name="guideLink"
                            value={settings.guideLink}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <Link
                            href={settings.guideLink}
                            target="_blank"
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                        >
                            <FiExternalLink className="w-5 h-5 text-blue-600" />
                        </Link>
                    </div>
                </div>
            </div>

            <button
                onClick={handleSave}
                disabled={isLoading}
                className={`mt-8 w-full py-2 px-4 ${isLoading ? "bg-gray-400" : "bg-blue-600"
                    } text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
            >
                {isLoading ? "Saving..." : "Save"}
            </button>

            {modal.isOpen && (
                <Modal
                    message={modal.message}
                    isSuccess={modal.isSuccess}
                    onClose={() => setModal((prev) => ({ ...prev, isOpen: false }))}
                />
            )}
        </div>
    );
};

export default AdminSettingPage;
