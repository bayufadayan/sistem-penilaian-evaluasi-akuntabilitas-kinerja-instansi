import AdminNavbar from "../components/adminNavbar";
import AdminSidebar from "../components/adminSidebar";
import AdminAddButton from "../components/adminAddButton";
import AdminEditButton from "../components/buttons/adminEditButton";
import Link from "next/link";
import { prisma } from "../../lib/prisma";

const getTeams = async () => {
  const res = await prisma.team.findMany({
    select: {
      id: true,
      name: true,
    },
  })
  return res;
};

export default async function ManagementAccountPage() {
  const [teams] = await Promise.all([getTeams()]);

  return (
    <>
      {console.log(teams)}
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
          <h1 className="text-2xl font-semibold mb-4">
            Manajemen Tim
          </h1>

          <AdminAddButton props="/admin/teams/create/" label="Tambah Tim" />
        </div>

        {/* Tabel Konten */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="py-2 pe-8">#</th>
                <th className="py-2 w-52">NAMA TIM</th>
                <th className="py-2">Anggota</th>
                <th className="py-2">AKSI</th>
              </tr>
            </thead>
            {teams.length > 0 ? (
              <tbody>
                {teams.map((team, index) => (
                  <tr className="border-b" key={team.id}>
                    <td className="py-4">{index + 1}</td>
                    <td className="pe-8">{team.name.toUpperCase()}</td>
                    <td>
                      <button type="button" className="btn btn-primary">Tambah Anggota</button>
                      <button type="button" className="btn btn-primary">Lihat Anggota</button>
                      </td>
                    <td>
                      <AdminEditButton
                        props={`/admin/accounts/edit/${team.id}`}
                      />

                      {/* <DeleteAccount team={team} /> */}
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
