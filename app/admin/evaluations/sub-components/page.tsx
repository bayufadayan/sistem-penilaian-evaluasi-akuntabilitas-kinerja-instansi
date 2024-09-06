import React from "react";
import AdminSidebar from "../../components/adminSidebar";
import AdminNavbar from "../../components/adminNavbar";
import Link from "next/link";
import { prisma } from "../../../lib/prisma";

const getSubComponents = async () => {
  const res = await prisma.subComponent.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      weight: true,
    },
  });
  return res;
};

export default async function EvaluationPage() {

  const [subComponents] = await Promise.all([getSubComponents()]);

  return (
    <div className="bg-slate-100 min-h-screen text-slate-800">
      <AdminSidebar />
      <AdminNavbar />
      <div className="p-8 ml-64 mt-1">
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
              <th className="py-2 pe-8">#</th>
                <th className="py-2 w-52">NAMA KOMPONEN</th>
                <th className="py-2">DESKIPSI</th>
                <th className="py-2">BOBOT</th>
                <th className="py-2">AKSI</th>
              </tr>
            </thead>
            {subComponents.length > 0 ? (
              <tbody>
              {subComponents.map((subComponent, index) => (
                <tr className="border-b" key={subComponent.id}>
                  <td className="py-4 pe-8">{index + 1}</td>
                  <td className="">{subComponent.name.toUpperCase()}</td>
                  <td className="">{subComponent.description}</td>
                  <td className="">{subComponent.weight}</td>
                  <td>
                    <span className="flex items-stretch justify-start space-x-0">
                      {/* <UpdateTeam team={team} />
                      <DeleteTeam team={team} /> */}
                    </span>
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
    </div>
  );
}
