import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AddSubComponent from "./addSubComponent";
import UpdateSubComponent from "./updateSubComponent";
import DeleteSubComponent from "./deleteSubComponent";

const getSubComponents = async () => {
  const res = await prisma.subComponent.findMany({
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
    },
  });
  return res;
};

const getComponents = async () => {
  const res = await prisma.component.findMany();
  return res;
};

export default async function EvaluationPage() {

  const [subComponents, components] = await Promise.all([getSubComponents(), getComponents()]);

  return (
  
      <div>
        {/* Breadcrumb */}
        <div className="mb-4 text-gray-500">
          <Link href="#" className="text-blue-600">
            Dashboard
          </Link>
          / Manajemen Sub Komponen
        </div>

        {/* Manajemen User Bang */}
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-2xl font-semibold mb-4"> Manajemen Sub Komponen</h1>

          <AddSubComponent components={components} />
        </div>

        {/* Tabel Konten */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 border-b">
              <th className="py-2 pe-8">#</th>
                <th className="py-2 w-52">NAMA KOMPONEN</th>
                <th className="py-2">BOBOT</th>
                <th className="py-2">KOMPONEN</th>
                <th className="py-2">AKSI</th>
              </tr>
            </thead>
            {subComponents.length > 0 ? (
              <tbody>
              {subComponents.map((subComponent, index) => (
                <tr className="border-b" key={subComponent.id}>
                  <td className="py-4 pe-8">{index + 1}</td>
                  <td className="">{subComponent.name.toUpperCase()}</td>
                  <td className="">{subComponent.weight}</td>
                  <td className="">{subComponent.component.name}</td>
                  <td>
                    <span className="flex items-stretch justify-start space-x-0">
                      <UpdateSubComponent subComponent={subComponent} components={components}/>
                      <DeleteSubComponent subComponent={subComponent} />
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
  );
}
