import AddTeam from "./addTeam";
import UpdateTeam from "./updateTeam";
import DeleteTeam from "./deleteTeam";
import { TiHome } from "react-icons/ti";
import { IoIosArrowForward } from "react-icons/io";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

const getTeams = async () => {
  const res = await prisma.team.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  return res;
};

export default async function ManagementAccountPage() {
  const [teams] = await Promise.all([getTeams()]);

  return (
    <>
      {console.log(teams)}

      {/* content nya */}
      <div>
        {/* Breadcrumb */}
        <div className="mb-4 text-gray-500 flex gap-1 items-start">
          <Link href="/admin" className="text-blue-600">
            <span className="flex gap-1">
              <TiHome className="mt-0.5" /> Dashboard
            </span>
          </Link>
          <IoIosArrowForward className="h-5 w-5" />Manajemen Tim
        </div>

        {/* Manajemen User Bang */}
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-2xl font-semibold mb-4">Manajemen Tim</h1>

          <AddTeam teams={teams} />
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
                    <td className="">
                      <button type="button" className="btn btn-primary">
                        Tambah Anggota
                      </button>
                      <button type="button" className="btn btn-primary">
                        Lihat Anggota
                      </button>
                    </td>
                    <td>
                      <span className="flex items-stretch justify-start space-x-0">
                        <UpdateTeam team={team} />
                        <DeleteTeam team={team} />
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
