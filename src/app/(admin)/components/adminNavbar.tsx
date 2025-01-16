"use client";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { FaUserTie } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import { LuRefreshCcw } from "react-icons/lu";
import AdminNavbarDropdown from "./adminNavbarDropdown";

export default function AdminNavbar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };


    document.addEventListener("mousedown", handleClickOutside);


    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="fixed top-0 left-64 w-[calc(100%-16rem)] h-16 bg-white border-b border-gray-200 z-40 flex items-center justify-between px-4">
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
        {/* <button
          type="button"
          className="btn -ml-3 mr-2 bg-transparent p-2 border-none shadow-none hover:shadow-md hover:bg-slate-200"
          onClick={() => router.replace(`?timestamp=${new Date().getTime()}`)}
        >
          <LuRefreshCcw className="text-2xl font-bold" />
        </button> */}
      </div>

      {/* Right Side (Profile Section) */}
      <div className="flex items-center space-x-6">

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
            <div ref={dropdownRef}>
              <AdminNavbarDropdown />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
