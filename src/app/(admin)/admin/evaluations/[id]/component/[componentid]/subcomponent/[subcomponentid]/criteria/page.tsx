import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AddCriteria from "./addCriterias";
import DeleteCriteria from "./deleteCriterias";
import UpdateCriteria from "./updateCriterias";
import { FiBarChart2 } from "react-icons/fi";
import UploadExcel from "./uploadExcelCriteria";
import { TiHome } from "react-icons/ti";
import { IoIosArrowForward } from "react-icons/io";

const getCriteriasBySubComponentId = async (subcomponentid: string) => {
  const res = await prisma.criteria.findMany({
    where: {
      id_subcomponents: Number(subcomponentid),
    },
    select: {
      id: true,
      name: true,
      description: true,
      criteria_number: true,
      id_subcomponents: true,
      subComponent: {
        select: {
          name: true,
        },
      },
    },
  });
  return res;
};

export default async function ManagementAccountPage({
  params,
}: {
  params: { subcomponentid: string };
}) {
  const { subcomponentid } = params;

  let criterias = await getCriteriasBySubComponentId(subcomponentid);

  criterias = criterias.sort((a, b) => a.criteria_number - b.criteria_number);

  return (
    <>
      {console.log(criterias)}

      {/* content nya */}
      <div>
        {/* Breadcrumb */}
        <div className="mb-4 text-gray-500 flex gap-1 items-start">
          <Link href="/admin" className="text-blue-600">
            <span className="flex gap-1">
              <TiHome className="mt-0.5" /> Dashboard
            </span>
          </Link>
          <IoIosArrowForward className="h-5 w-5" />
          <Link href="/admin/evaluations" className="hover:text-blue-600">
            <span>Lembar Kerja Evaluasi</span>
          </Link>
          <IoIosArrowForward className="h-5 w-5" />
          <Link href={"admin/evaluations/"} className="hover:text-blue-600">
            <span>Komponen</span>
          </Link>
          <IoIosArrowForward className="h-5 w-5" />
          <Link href={"admin/evaluations/"} className="hover:text-blue-600">
            <span>Sub Komponen</span>
          </Link>
          <IoIosArrowForward className="h-5 w-5" />
          <span>Kriteria</span>
        </div>

        <h1 className="text-2xl font-semibold">Manajemen Kriteria</h1>
        <p className="text-sm text-gray-500 italic mb-6">
          <b>Sub Komponen:</b>{" "}
          {criterias[0]?.subComponent.name || "Nama Komponen Tidak Ditemukan"}
        </p>

        <div className="grid grid-cols-1 gap-6 mb-4">
          {/* Card 1: Jumlah Sub Komponen */}
          <div className="p-5 bg-white rounded-lg shadow-lg flex items-center justify-between border-l-4 border-blue-600">
            <div>
              <h2 className="text-md font-bold text-blue-600 mb-2">
                Jumlah Kriteria
              </h2>
              <p className="text-3xl font-bold text-blue-600">
                {criterias.length}
              </p>
            </div>
            <FiBarChart2 className="text-blue-600 w-12 h-12" />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2">
          <AddCriteria subComponentId={subcomponentid} />
          <UploadExcel subComponentId={subcomponentid} />
        </div>

        {/* Tabel Konten */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="py-2 pe-8 w-10">#</th>
                <th className="py-2 w-1/2">NAMA CRITERIA</th>
                <th className="py-2 min-w-10">DESKRIPSI</th>
                <th className="py-2">AKSI</th>
              </tr>
            </thead>
            {criterias.length > 0 ? (
              <tbody>
                {criterias.map((criteria, index) => (
                  <tr className="border-b" key={criteria.id}>
                    <td className="py-4">{index + 1}</td>
                    <td className="pe-8 py-2">{criteria.name.toUpperCase()}</td>
                    <td className="text-blue-500">
                      {criteria.description === ""
                        ? "Tidak Ada Deskripsi"
                        : criteria.description}
                    </td>
                    <td>
                      <span className="flex items-stretch justify-start space-x-0">
                        <UpdateCriteria
                          criteria={criteria}
                          subComponentId={subcomponentid}
                        />
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
