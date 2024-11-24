import React, { useState, useEffect, useRef } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";

export default function TableRow({ score }: { score: any }) {
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
    const submenuRef = useRef<HTMLDivElement>(null);

    const toggleSubmenu = () => {
        setIsSubmenuOpen(!isSubmenuOpen);
    };

    const closeSubmenu = (e: MouseEvent) => {
        // Check if the click was outside the submenu
        if (submenuRef.current && !submenuRef.current.contains(e.target as Node)) {
            setIsSubmenuOpen(false);
        }
    };

    useEffect(() => {
        if (isSubmenuOpen) {
            document.addEventListener("mousedown", closeSubmenu);
        } else {
            document.removeEventListener("mousedown", closeSubmenu);
        }

        return () => {
            document.removeEventListener("mousedown", closeSubmenu);
        };
    }, [isSubmenuOpen]);

    return (
        <td className="text-right relative">
            <div className="flex justify-center items-center">
                <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 hover:text-gray-700 focus:ring-2 focus:ring-gray-300 focus:outline-none"
                    onClick={toggleSubmenu}
                >
                    <FiMoreHorizontal />
                </button>
            </div>
            {isSubmenuOpen && (
                <div
                    ref={submenuRef}
                    className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                >
                    <ul className="py-1">
                        <li>
                            <button
                                onClick={() => alert(`Detail for ${score.id}`)}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                                <span className="flex items-center gap-2">
                                    <IoMdInformationCircleOutline className="h-5 w-5 text-gray-700" />
                                    Detail
                                </span>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => alert(`Edit ${score.id}`)}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                                <span className="flex items-center gap-2">
                                    <CiEdit className="h-5 w-5 text-gray-700" />
                                    Edit
                                </span>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => alert(`Delete ${score.id}`)}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                                <span className="flex items-center gap-2">
                                    <MdDeleteOutline className="h-5 w-5 text-gray-700" />
                                    Delete
                                </span>
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </td>
    );
}
