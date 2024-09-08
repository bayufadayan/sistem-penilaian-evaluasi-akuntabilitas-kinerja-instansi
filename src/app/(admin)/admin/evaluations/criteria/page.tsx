import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AddCriteria from "./addCriterias";
import DeleteCriteria from "./deleteCriterias";
import UpdateCriteria from "./updateCriterias";

const getCriterias = async () => {
  const res = await prisma.criteria.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      id_subcomponents: true,
      subComponent: {
        select: {
          name: true,
        }
      }
    },
  });
  return res;
};

const getSubComponents = async () => {
  const res = await prisma.subComponent.findMany();
  return res;
};

export default async function ManagementAccountPage() {
  const [criterias, subComponents] = await Promise.all([getCriterias(), getSubComponents()]);

  return (
    <>
      {console.log(criterias)}

      {/* content nya */}
      <div>
        {/* Breadcrumb */}
        <div className="mb-4 text-gray-500">
          <Link href="#" className="text-blue-600">
            Dashboard
          </Link>{" "}
          / Manajemen Tim
        </div>

        {/* Manajemen User Bang */}
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-2xl font-semibold mb-4">Manajemen Tim</h1>

          <AddCriteria subComponents={subComponents}/>
        </div>

        {/* Tabel Konten */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="py-2 pe-8">#</th>
                <th className="py-2 w-52">NAMA CRITERIA</th>
                <th className="py-2">DESKRIPSI</th>
                <th className="py-2">SUB KOMPONEN</th>
                <th className="py-2">AKSI</th>
              </tr>
            </thead>
            {criterias.length > 0 ? (
              <tbody>
                {criterias.map((criteria, index) => (
                  <tr className="border-b" key={criteria.id}>
                    <td className="py-4">{index + 1}</td>
                    <td className="pe-8">{criteria.name.toUpperCase()}</td>
                    <td className="">{criteria.description}</td>
                    <td className="">{criteria.subComponent.name}</td>
                    <td>
                      <span className="flex items-stretch justify-start space-x-0">
                        <UpdateCriteria criteria={criteria} subComponents={subComponents} />
                        <DeleteCriteria criteria={criteria} />
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
    </>
  );
}
