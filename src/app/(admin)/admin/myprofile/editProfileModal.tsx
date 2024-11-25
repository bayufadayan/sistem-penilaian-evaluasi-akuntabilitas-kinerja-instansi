/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

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
            onSave(updatedUser); // Callback ke parent
            onClose();
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Gagal memperbarui data pengguna.");
        }
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
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
                            <button
                                type="button"
                                onClick={() => alert("Fitur Ubah Password Belum Diimplementasikan!")}
                                className="mt-2 px-4 py-2 flex gap-2 items-center justify-center bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                <IoKeyOutline />Ubah Password
                            </button>
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
                    <div>
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
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Status</label>
                        <select
                            name="status"
                            value={formValues.status}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="ACTIVE">Aktif</option>
                            <option value="INACTIVE">Tidak Aktif</option>
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
