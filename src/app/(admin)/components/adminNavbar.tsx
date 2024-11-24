"use client";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { FaUserTie } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoMdArrowBack } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { LuRefreshCcw } from "react-icons/lu";

export default function AdminNavbar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };


  return (
    <header className="fixed top-0 left-64 w-[calc(100%-16rem)] h-16 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-4">
      {/* Search Bar */}

      <div className="flex items-center gap-1">
        <button
          type="button"
          className="btn -ml-3 mr-2 bg-transparent p-2 border-none shadow-none hover:shadow-md hover:bg-slate-200"
          onClick={() => router.back()}
        >
          <IoMdArrowBack className="text-3xl" />
        </button>
        <button
          type="button"
          className="btn -ml-3 mr-2 bg-transparent p-2 border-none shadow-none hover:shadow-md hover:bg-slate-200"
          onClick={() => document.location.reload()}
        >
          <LuRefreshCcw className="text-2xl font-bold" />
        </button>
        
        <div className="relative">
          <div className="absolute flex items-center h-full left-2 opacity-40 text-slate-600 active:text-black">
            <FiSearch className="text-2xl font-black" />
          </div>

          <input
            type="text"
            placeholder="Type to search..."
            className="pl-10 pr-4 py-2 w-80 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
        </div>
      </div>

      {/* Right Side (Profile Section) */}
      <div className="flex items-center space-x-6">
        {/* Notifications */}
        <div className="relative">
          <button
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            type="button"
          >
            <IoMdNotificationsOutline className="text-gray-500 w-6 h-6" />
          </button>
        </div>

        {/* Profile Info with Dropdown */}
        <div className="relative">
          <button
            type="button"
            className="flex items-center space-x-3 p-2 bg-gray-100 rounded-full hover:bg-gray-200"
            onClick={toggleDropdown}
          >
            {/* Admin Icon */}
            <FaUserTie className="w-8 h-8 text-gray-600" />
            <div>
              <p className="text-gray-900 font-semibold">
                {status === "loading"
                  ? "Loading..."
                  : session?.user?.name || "Admin"}
              </p>
              <p className="text-sm text-gray-500">Administrator</p>
            </div>
            <svg
              className="w-4 h-4 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <title hidden>Dropdown Icon</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
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

                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <a href="/admin/profile">Profile</a>
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
          )}
        </div>
      </div>
    </header>
  );
}
