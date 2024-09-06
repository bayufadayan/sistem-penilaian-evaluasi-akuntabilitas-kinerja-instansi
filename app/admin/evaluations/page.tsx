import React from "react";
import AdminSidebar from "../components/adminSidebar";
import AdminNavbar from "../components/adminNavbar";
import Link from "next/link";
import { prisma } from "../../lib/prisma";

const getEvalSheets = async () => {
  const res = await prisma.evaluationSheet.findMany({
    select: {
      id: true,
      title: true,
      date_start: true,
      date_finish: true,
      description: true,
      status: true,
      year: true,
    },
  });
  return res;
};

export default async function EvaluationPage() {

  const [evalsheets] = await Promise.all([getEvalSheets()]);

  return (
    <>
      <AdminSidebar />
      <AdminNavbar />
      <div className="p-8 ml-64 mt-14">
        {/* Breadcrumb */}
        <div className="mb-4 text-gray-500">
          <Link href="#" className="text-blue-600">
            Dashboard
          </Link>
          / Lembar Kerja Evaluasi
        </div>

        {/* Manajemen User Bang */}
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-2xl font-semibold mb-4">Manajemen Tim</h1>

          {/* <AddTeam teams={teams} /> */}
        </div>

        {/* Tabel Konten */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="py-2 text-center">#</th>
                <th className="py-2 ps-4">JUDUL</th>
                <th className="py-2 ps-4">DESC</th>
                <th className="py-2 text-center">MULAI</th>
                <th className="py-2 text-center">SELESAI</th>
                <th className="py-2 text-center">STATUS</th>
                <th className="py-2 text-center">TAHUN</th>
                <th className="py-2 text-center">AKSI</th>
              </tr>
            </thead>
            {evalsheets.length > 0 ? (
              <tbody>
              {evalsheets.map((evalsheet, index) => (
                <tr className="border-b" key={evalsheet.id}>
                  <td className="px-4 py-2 text-center">{index + 1}</td>
                  <td className="px-4 py-2">{evalsheet.title.toUpperCase()}</td>
                  <td className="px-4 py-2">{evalsheet.description}</td>
                  <td className="px-4 py-2 text-center">
                    {new Date(evalsheet.date_start).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {new Date(evalsheet.date_finish).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-center">{evalsheet.status}</td>
                  <td className="px-4 py-2 text-center">{evalsheet.year}</td>
                  <td className="px-4 py-2 text-center">
                    <div className="flex justify-center space-x-2">
                      <button type="button" className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-700">dit</button>
                      <button type="button" className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-700">del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            
            ) : (
              <tbody>
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    <p className="text-gray-500">Data tidak ditemukan</p>
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>
    </>
  );
}
