import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AddSubComponent from "./addSubComponent";
import UpdateSubComponent from "./updateSubComponent";
import DeleteSubComponent from "./deleteSubComponent";
import CriteriaLink from "./criteriaLink";
import { FiExternalLink, FiBarChart2, FiPieChart } from "react-icons/fi";

// Ambil sub-komponen berdasarkan `id_component` dari URL
const getSubComponentsByComponentId = async (componentId: string) => {
  const res = await prisma.subComponent.findMany({
    where: {
      id_components: Number(componentId),
    },
    select: {
      id: true,
      name: true,
      description: true,
      weight: true,
      subcomponent_number: true,
      id_components: true,
      component: {
        select: {
          name: true,
        },
      },
      criteria: true,
    },
  });
  return res;
};

export default async function EvaluationPage({
  params,
}: {
  params: { componentid: string };
}) {
  const { componentid } = params;

  let subComponents = await getSubComponentsByComponentId(componentid);

  subComponents = subComponents.sort(
    (a, b) => a.subcomponent_number - b.subcomponent_number
  );

  // Menghitung jumlah total bobot
  const totalBobot = subComponents.reduce(
    (acc, subComponent) => acc + subComponent.weight,
    0
  );

  return (
    <div>
      <div className="mb-4 text-gray-500">
        <Link href="/admin" className="text-blue-600">
          Dashboard
        </Link>
        <Link href="#" className="text-blue-600">
          / Manajemen Komponen
        </Link>
        / Manajemen Sub Komponen
      </div>

      <h1 className="text-2xl font-semibold">Manajemen Sub Komponen</h1>
      <p className="text-sm text-gray-500 italic mb-6">
        <b>Komponen:</b>{" "}
        {subComponents[0]?.component.name || "Nama Komponen Tidak Ditemukan"}
      </p>

      {/* Tambahkan Card untuk Jumlah Sub Komponen dan Total Bobot */}
      <div className="grid grid-cols-2 gap-6 mb-4">
        {/* Card 1: Jumlah Sub Komponen */}
        <div className="p-5 bg-white rounded-lg shadow-lg flex items-center justify-between border-l-4 border-blue-600">
          <div>
            <h2 className="text-md font-bold text-blue-600 mb-2">
              Jumlah Sub Komponen
            </h2>
            <p className="text-3xl font-bold text-blue-600">
              {subComponents.length}
            </p>
          </div>
          <FiBarChart2 className="text-blue-600 w-12 h-12" />
        </div>

        {/* Card 2: Total Bobot */}
        <div className="p-5 bg-white rounded-lg shadow-lg flex items-center justify-between border-l-4 border-green-600">
          <div>
            <h2 className="text-md font-bold text-green-600 mb-2">
              Total Bobot
            </h2>
            <p className="text-3xl font-bold text-green-600">
              {totalBobot.toFixed(2)}
            </p>
          </div>
          <FiPieChart className="text-green-600 w-12 h-12" />
        </div>
      </div>

      <div className="mt-6 flex">
        <AddSubComponent componentId={componentid} />
        <button className="btn" type="button">
          Import Excel
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-500 border-b">
              <th className="py-2 px-4 w-44">
                <FiExternalLink className="w-5 h-5 text-gray-600" />
              </th>
              <th className="py-2 px-4 w-1/2">NAMA KOMPONEN</th>
              <th className="py-2 px-4 min-w-10">BOBOT</th>
              <th className="py-2 px-4">AKSI</th>
            </tr>
          </thead>
          {subComponents.length > 0 ? (
            <tbody>
              {subComponents.map((subComponent) => (
                <tr className="border-b" key={subComponent.id}>
                  <td className="py-4 px-4">
                    <CriteriaLink subcomponentId={subComponent.id} length={subComponent.criteria.length}/>
                  </td>
                  <td className="py-4 px-4">
                    {subComponent.name.toUpperCase()}
                  </td>
                  <td className="py-4 px-4">{subComponent.weight}</td>
                  <td className="py-4 px-4">
                    <span className="flex items-stretch justify-start space-x-2">
                      {/* Update dan Delete Sub-Komponen */}
                      <UpdateSubComponent
                        subComponent={subComponent}
                        componentId={componentid}
                      />
                      <DeleteSubComponent subComponent={subComponent} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan={4} className="text-center py-4">
                  <p className="text-gray-500">Data tidak ditemukan</p>
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
