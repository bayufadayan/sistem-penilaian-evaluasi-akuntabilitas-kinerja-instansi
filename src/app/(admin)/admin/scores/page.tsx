import React from "react";
import Link from "next/link";
import { TiHome } from "react-icons/ti";
import { IoIosArrowForward } from "react-icons/io";
import ScoreTable from "./scoreTable";

export default function ScoreManagementPage() {
  return (
    <div>
      <div className="mb-4 text-gray-500 flex gap-1 items-start">
        <Link href="/admin" className="text-blue-600">
          <span className="flex gap-1">
            <TiHome className="mt-0.5" /> Dashboard
          </span>
        </Link>
        <IoIosArrowForward className="h-5 w-5" />
        <span>Manajemen Nilai</span>
      </div>

      <div className="flex justify-between items-center mb-1">
        <h1 className="text-2xl font-semibold mb-4">Manajemen Skor</h1>
      </div>

      <div className="flex items-end justify-start gap-4">
        {/* Dropdown Select */}
        <form className="h-full">
          <select
            id="countries"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 h-[44px]"
          >
            <option selected>Pilih Lembar Kerja Evaluasi</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="FR">France</option>
            <option value="DE">Germany</option>
          </select>
        </form>
      </div>

      <ScoreTable />

    </div>
  );
}
