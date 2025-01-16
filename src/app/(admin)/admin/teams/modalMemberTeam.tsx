"use client";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";

type User = {
    id: number;
    name: string;
};

type Team = {
    id: number;
    name: string;
    users: User[];
};


export default function ModalMemberTeam({ team }: { team: Team }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleModal = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            <button type="button" onClick={handleModal} className="btn btn-primary flex text-white">
                Lihat Anggota
            </button>

            <div className={isOpen ? "modal modal-open" : "modal"}>
                <div className="modal-box text-black">
                    <span className="flex justify-between">
                        <h3 className="font-bold text-lg">Daftar Anggota Tim {team.name}</h3>
                        <button type="button" className="p-2 bg-red-100 rounded-lg text-red-600" onClick={handleModal}>
                            <IoMdClose />
                        </button>
                    </span>
                    <ul className="mt-4">
                        {
                            team.users.length != 0 ? (team.users.map((user) => (
                                <li key={user.id} className="flex items-center"><span className="text-gray-400 text-sm me-3">►</span> {user.name}</li>
                            ))) : (<li className="italic text-gray-500">Tidak ada user dalam tim ini</li>)
                        }
                    </ul>

                    <div className="modal-action">
                        <button type="button" className="btn" onClick={handleModal}>
                            Keluar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
