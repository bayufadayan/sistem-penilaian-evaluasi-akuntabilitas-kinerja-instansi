"use client";
import Link from "next/link";
import { FiHome } from "react-icons/fi";
import { signOut } from "next-auth/react";
import { MdOutlineAccountCircle } from "react-icons/md";
import { FaRegChartBar } from "react-icons/fa";
import { AiOutlineTeam } from "react-icons/ai";
import { LuClipboardCheck } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineManageAccounts } from "react-icons/md";
import { VscSignOut } from "react-icons/vsc";

export default function AdminSidebar() {
  return (
    <>
      <button
        type="button"
        className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className="fixed top-0 left-0 z-40 w-64 h-screen bg-gray-50 dark:bg-gray-800 transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center mb-6 mt-2 gap-4 justify-center flex-col">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 256 256"
              fill="none"
            >
              <title hidden>au</title>
              <g clipPath="url(#clip0_420_600)">
                <path
                  d="M127.963 0C198.912 0.559 255.754 55.473 255.999 129.303C256.222 196.981 200.939 257.457 124.745 255.973C55.2451 254.618 -1.52285 198.006 0.0301474 124.088C1.40315 58.802 54.6681 0.675 127.963 0ZM101.003 147.357C105.554 147.357 110.107 147.367 114.658 147.352C116.834 147.345 118.197 147.837 117.69 150.565C116.574 156.565 115.66 162.6 114.68 168.621C112.833 179.971 110.992 191.323 109.157 202.676C108.981 203.758 108.416 204.914 109.81 205.661C112.182 206.93 118.67 205.314 120.011 203.074C137.018 174.694 154.017 146.309 171.006 117.918C174.536 112.013 172.684 108.82 165.76 108.768C157.795 108.712 149.829 108.712 141.863 108.768C139.389 108.783 137.708 108.456 138.304 105.219C140.081 95.59 141.704 85.933 143.332 76.277C144.605 68.717 145.824 61.1483 146.991 53.571C147.165 52.441 147.853 51.041 146.011 50.371C144.093 49.8137 142.049 49.8662 140.161 50.5211C138.274 51.176 136.637 52.4011 135.476 54.027C122.393 75.8148 109.321 97.6088 96.2581 119.409C92.3161 125.986 88.2551 132.494 84.4991 139.177C81.6841 144.182 83.5321 147.282 89.0571 147.342C93.0381 147.385 97.0221 147.351 101.005 147.359L101.003 147.357Z"
                  fill="#1D5FE6"
                />
              </g>
              <defs>
                <clipPath id="clip0_420_600">
                  <rect width="256" height="256" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <Link href={"/"}>
              <span className="text-2xl font-semibold text-gray-900 dark:text-white">
                Admin BPMSPH
              </span>
            </Link>
          </div>

          {/* Menu Items */}
          <div className="flex gap-4 flex-col">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/admin"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FiHome className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                  <span className="ml-3 mt-1">Dashboard</span>
                </Link>
              </li>
            </ul>

            <hr className="opacity-20" />

            <ul className="space-y-2">
              <h3 className="text-sm font-normal mb-2 text-white">Menu</h3>
              <li>
                <Link
                  href="/admin/accounts"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <MdOutlineAccountCircle className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                  <span className="ml-3">Manajemen Akun</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/teams/"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <AiOutlineTeam className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                  <span className="ml-3">Manajemen Tim</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/evaluations/"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FaRegChartBar className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                  <span className="ml-3">Manajemen LKE AKIP</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/scores"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LuClipboardCheck className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white mb-1" />
                  <span className="ml-3">Manajemen Nilai</span>
                </Link>
              </li>
            </ul>

            <hr className="opacity-20" />

            <ul className="space-y-2">
              <h3 className="text-sm font-normal mb-2 text-white">
                Pengaturan
              </h3>
              <li>
                <Link
                  href="/admin/accounts"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <IoSettingsOutline className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                  <span className="ml-3">Pengaturan Umum</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/teams/"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <MdOutlineManageAccounts className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                  <span className="ml-3">Akun</span>
                </Link>
              </li>
              {/* <hr className="opacity-20" /> */}
              <li
                className="p-2 cursor-pointer rounded-lg hover:bg-red-700 hover:text-white flex items-center text-red-500"
                onClick={() => signOut()}
              >
                <VscSignOut className="w-6 h-6 transition duration-75 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="ml-2 mt-1">Keluar</span>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
}
