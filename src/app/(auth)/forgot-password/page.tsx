/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useState } from "react";
import axios from "axios";
import NavbarLite from "@/components/navbarLite";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleForgotPassword = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post("/api/auth/forgot-password", { email });

            if (response.data.message) {
                setMessage(response.data.message);
                setIsEmailSent(true);
            }
        } catch (error: any) {
            if (error.response && error.response.data) {
                setMessage(error.response.data.message || "Something went wrong. Please try again.");
            } else {
                setMessage("Something went wrong. Please try again.");
            }
            setIsEmailSent(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendForm = () => {
        setIsEmailSent(false);
        setEmail("");
        setMessage("");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); 
        handleForgotPassword();
    };

    return (
        <>
            <NavbarLite />
            <div className="max-w-md mx-auto mt-10 p-6 bg-gray-50 shadow rounded-lg">
                <h1 className="text-xl font-bold mb-4 flex items-center gap-1">
                    <button className="p-2" onClick={() => router.back()}>
                        <FaArrowLeftLong />
                    </button>
                    <span>Lupa Password</span>
                </h1>
                <p className="text-gray-600 mb-6">Masukkan email untuk mengganti password Anda.</p>

                {isEmailSent ? (
                    <div className="text-center">
                        <p className="text-green-600 mb-4 mt-2">{message}</p>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-12 h-12 mx-auto text-green-600 mb-10"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                        <p className="text-gray-600 mb-4">
                            Silakan cek email Anda untuk melanjutkan reset password.
                        </p>
                        <button
                            onClick={handleResendForm}
                            className="w-full bg-blue-600 text-white py-2 rounded"
                        >
                            Kirim Ulang
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full p-2 border rounded mb-4"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded flex justify-center items-center hover:bg-blue-400"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                    ></path>
                                </svg>
                            ) : (
                                "Send Reset Link"
                            )}
                        </button>
                        {message && <p className="text-red-600 mt-4">{message}</p>}
                    </form>
                )}
            </div>
        </>
    );
}
