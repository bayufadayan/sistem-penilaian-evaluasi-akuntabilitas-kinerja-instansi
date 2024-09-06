import AdminNavbar from "../../components/adminNavbar";
import AdminSidebar from "../../components/adminSidebar";
import Link from "next/link";
import { prisma } from "../../../lib/prisma";

const getCriterias = async () => {
  const res = await prisma.criteria.findMany({
    select: {
      id: true,
      name: true,
      description: true,
    },
  });
  return res;
};

export default async function ManagementAccountPage() {
  const [criterias] = await Promise.all([getCriterias()]);

  return (
    <>
      {console.log(criterias)}
      <AdminNavbar />
      <AdminSidebar />

      {/* content nya */}
      <div className="p-8 ml-64 mt-14">
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

          {/* <AddTeam teams={teams} /> */}
        </div>

        {/* Tabel Konten */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="py-2 pe-8">#</th>
                <th className="py-2 w-52">NAMA CRITERIA</th>
                <th className="py-2">DESKRIPSI</th>
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
    </>
  );
}
