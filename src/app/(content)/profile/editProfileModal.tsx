/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { IoKeyOutline } from "react-icons/io5";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    userDetails: {
        id: string;
        email: string;
        nip: string;
        name: string;
        role: string;
        gender: string;
        status: string;
        team: string;
    };
    onSave: (updatedDetails: any) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
    isOpen,
    onClose,
    userDetails,
    onSave,
}) => {
    const [formValues, setFormValues] = useState(userDetails);
    const [isLoading, setIsLoading] = useState(false);

    // Update formValues setiap kali userDetails berubah
    useEffect(() => {
        if (isOpen) {
            setFormValues(userDetails);
        }
    }, [isOpen, userDetails]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/users/${userDetails.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formValues,
                    nip: parseInt(formValues.nip, 10), // Konversi NIP ke angka
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update user");
            }

            const updatedUser = await response.json();
            onSave(updatedUser);
            setIsLoading(false);
            onClose();
        } catch (error) {
            setIsLoading(false)
            console.error("Error updating user:", error);
            alert("Gagal memperbarui data pengguna.");
        }
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
            onKeyDown={(event) => {
                if (event.key === "Enter") {
                    handleSave();
                }
            }}
        >
            <div className="flex flex-col bg-white rounded-lg shadow-lg w-full max-w-xl p-6 max-h-[70vh] overflow-y-auto mt-20" >
                {
                    (isLoading &&
                        (<div className="fixed flex items-center flex-col gap-3 inset-0 m-auto bg-slate-500 text-white p-4 rounded-lg shadow-md opacity-80 w-fit h-fit z-30">
                            <svg
                                aria-hidden="true"
                                className="w-10 h-10 text-gray-200 animate-spin dark:text-white-600 fill-blue-400 mr-2"
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
                            </svg> Loading...
                        </div>)
                    )
                }
                <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Profil</h2>
                <div className="space-y-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-600">Email</label>
                        <div>
                            <input
                                type="email"
                                name="email"
                                value={formValues.email}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            <Link
                                href="/forgot-password"
                                className={`${userDetails.gender === "FEMALE" ? " bg-pink-600 hover:bg-pink-700 focus:ring-pink-500" : "hover:bg-blue-700 focus:ring-blue-500 bg-blue-600"} mt-2 px-4 py-2 flex gap-2 items-center justify-center text-white rounded-md shadow-md focus:outline-none focus:ring-2  focus:ring-offset-2`}
                            >
                                <IoKeyOutline />Ubah Password
                            </Link>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600">Nama</label>
                        <input
                            type="text"
                            name="name"
                            value={formValues.name}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">NIP</label>
                        <input
                            type="text"
                            name="nip"
                            value={formValues.nip}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="hidden">
                        <label className="block text-sm font-medium text-gray-600">Role</label>
                        <select
                            name="role"
                            value={formValues.role}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="ADMIN">Admin</option>
                            <option value="USER">User</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Gender</label>
                        <select
                            name="gender"
                            value={formValues.gender}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="MALE">Laki-laki</option>
                            <option value="FEMALE">Perempuan</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-end mt-6 gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Simpan
                    </button>
                </div>
            </div>
        </div>

    );
};

export default EditProfileModal;
