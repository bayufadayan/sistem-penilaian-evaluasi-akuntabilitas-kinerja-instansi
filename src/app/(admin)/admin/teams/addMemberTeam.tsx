"use client";
import { type SyntheticEvent, useCallback, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import type { User } from "@prisma/client";
import axios from "axios";

type User2 = {
    id: number;
    name: string;
};

type Team = {
    id: number;
    name: string;
    users: User2[];
};

const fetchUsers = async () => {
    const res = await axios.get("/api/users");
    return res.data;
};

export default function AddMemberTeam({ team, onAddSuccess }: { team: Team; onAddSuccess: () => Promise<void>; }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [idUser, setIdUser] = useState("");
    const [users, setUsers] = useState<User[]>([]);

    const handleModal = () => {
        setIsOpen(!isOpen);
    };

    const handleUpdate = async (e: SyntheticEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.patch(`/api/users/${idUser}`, {
                updateType: "id_team",
                id_team: Number(team.id),
            });

            console.log("Response:", response.data);
            setIdUser("");
            setIsLoading(false);
            onAddSuccess();
            loadUsers();

            handleModal();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const loadUsers = useCallback(async () => {
        try {
            const usersData = await fetchUsers();
            setUsers(usersData);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    return (
        <div>
            <button type="button" onClick={handleModal} className="btn btn-primary flex text-white">
                Tambah Anggota
            </button>

            <div className={isOpen ? "modal modal-open" : "modal"}>
                <div className="modal-box text-black">
                    <span className="flex justify-between">
                        <h3 className="font-bold text-lg flex gap-2 items-center"><FaPlus /> Tambah Anggota Tim {team.name}</h3>
                        <button type="button" className="p-2 bg-red-100 rounded-lg text-red-600" onClick={handleModal}>
                            <IoMdClose />
                        </button>
                    </span>

                    <form onSubmit={handleUpdate} className="mt-4">
                        <select
                            value={idUser}
                            onChange={(e) => setIdUser(e.target.value)}
                            id="idTeam"
                            className="select select-bordered w-full"
                        >
                            <option value="">Silakan Pilih Anggota</option>
                            {users.map((user) => (
                                <option value={user.id} key={user.id} className={`${user.id_team === team.id ? "text-green-600" : "text-red-600"
                                    } whitespace-normal break-words flex flex-wrap text-wrap`}>
                                    {user.name}{(user.id_team == team.id) ? " (Sudah terdaftar di tim ini)" : ""}
                                </option>
                            ))}
                        </select>
                        <div className="modal-action">
                            {!isLoading ? (
                                <button
                                    type="submit"
                                    className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >
                                    Simpan
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                >
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
                                    Saving...
                                </button>
                            )}
                            <button type="button" className="btn" onClick={handleModal}>
                                Keluar
                            </button>
                        </div>


                    </form>
                </div>
            </div>
        </div>
    );
}
