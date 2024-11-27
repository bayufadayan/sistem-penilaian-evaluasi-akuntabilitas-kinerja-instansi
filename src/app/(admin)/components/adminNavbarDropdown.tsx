import React from 'react'
import { signOut } from "next-auth/react";

function AdminNavbarDropdown() {
    return (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20"
            onClick={(e) => {
                e.stopPropagation();
            }}
        >
            <ul className="py-1">
                {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
                <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                        window.location.href = "/";
                    }}
                >
                    <a href="/" className="block w-full h-full">
                        Beranda
                    </a>
                </li>

                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                        window.location.href = "/admin/myprofile";
                    }}
                >
                    <a href="/admin/myprofile">Profile</a>
                </li>
                {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
                <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => signOut()}
                >
                    Logout
                </li>
            </ul>
        </div>
    )
}

export default AdminNavbarDropdown