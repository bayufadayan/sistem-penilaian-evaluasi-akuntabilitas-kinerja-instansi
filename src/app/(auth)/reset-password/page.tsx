/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import NavbarLite from "@/components/navbarLite";
import { useRouter } from "next/navigation";
import { FaArrowLeftLong } from "react-icons/fa6";
import { signOut } from "next-auth/react";
import axios from "axios";
import { resetPasswordSchema } from "@/lib/form-schema";
import { z } from "zod";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const router = useRouter();

    const handleSignOutAndRedirect = useCallback(async () => {
        await signOut({ redirect: false });
        router.push("/login");
    }, [router]);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (isPasswordUpdated && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prevCountdown) => {
                    if (prevCountdown === 1) {
                        clearInterval(timer);
                        handleSignOutAndRedirect();
                    }
                    return prevCountdown - 1;
                });
            }, 1000);
        }

        return () => clearInterval(timer);
    }, [isPasswordUpdated, countdown, router, handleSignOutAndRedirect]);

    const handleResetPassword = async () => {
        setIsLoading(true);

        try {
            // Validasi password dengan Zod
            resetPasswordSchema.parse({ password });

            const response = await axios.post("/api/auth/reset-password", { token, password });
            setMessage(response.data.message);
            setIsPasswordUpdated(true);
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                // Jika validasi gagal
                setMessage(error.errors[0]?.message || "Validasi gagal");
            } else if (error.response && error.response.data) {
                setMessage(error.response.data.message || "Something went wrong. Please try again.");
            } else {
                setMessage("Something went wrong. Please try again.");
            }
            setIsPasswordUpdated(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleResetPassword();
    };

    return (
        <>
            <NavbarLite />
            <div className="max-w-md mx-auto mt-10 p-6 bg-gray-50 shadow rounded-lg">
                <h1 className="text-xl font-bold mb-4 flex items-center gap-1">
                    <button className="p-2" onClick={() => router.push("/forgot-password")}>
                        <FaArrowLeftLong />
                    </button>
                    <span>Reset Password</span>
                </h1>
                <p className="text-gray-600 mb-6">Masukan password baru Anda.</p>
                {!isPasswordUpdated ? (
                    <>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter new password"
                                className="w-full p-2 border rounded mb-4"
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
                                    "Reset Password"
                                )}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center">
                        <p className="text-green-600 mb-4">Password berhasil diperbarui!</p>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-12 h-12 mx-auto text-green-600"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="text-gray-600 mt-4">
                            Anda akan diarahkan ke halaman login dalam{" "}
                            <div className="font-bold">{countdown} detik.</div>
                        </p>
                    </div>
                )}
                {message && <p className="text-red-600 mt-4">{message}</p>}
            </div>
        </>
    );
}
