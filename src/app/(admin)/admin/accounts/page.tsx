import DeleteAccount from "./deleteAccount";
import AdminAddButton from "../components/adminAddButton";
import AdminEditButton from "../components/buttons/adminEditButton";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

const getUsers = async () => {
  const res = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      password: true,
      nip: true,
      name: true,
      role: true,
      gender: true,
      status: true,
      id_team: true,
      team: {
        select: {
          name: true,
        },
      },
    },
  });
  return res;
};

export default async function ManagementAccountPage() {
  const [users] = await Promise.all([getUsers()]);

  return (
    <>
      {console.log(users)}

      {/* content nya */}
      <div>
        {/* Breadcrumb */}
        <div className="mb-4 text-gray-500">
          <Link href="#" className="text-blue-600">
            Dashboard
          </Link>{" "}
          / Manajemen Akun
        </div>

        {/* Manajemen User Bang */}
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-2xl font-semibold mb-4">
            Manajemen Akun Pengguna
          </h1>

          <AdminAddButton props="/admin/accounts/create/" label="Tambah Akun"/>

        </div>

        {/* Tabel Konten */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="py-2 pe-8">#</th>
                <th className="py-2 w-52">NAMA LENGKAP</th>
                <th className="py-2 pe-8">NIP</th>
                <th className="py-2 pe-8">STATUS</th>
                <th className="py-2 pe-8">DIVISI</th>
                <th className="py-2">AKSI</th>
              </tr>
            </thead>
            {users.length > 0 ? (
              <tbody>
                {users.map((user, index) => (
                  <tr className="border-b" key={user.id}>
                    <td className="py-4">{index + 1}</td>
                    <td className="pe-8">{user.name.toUpperCase()}</td>
                    <td className="text-blue-500">{user.nip.toString()}</td>
                    <td
                      className={
                        user.status === "ACTIVE"
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      {user.status}
                    </td>
                    <td>{user.team?.name || 'Tidak ada tim'}</td>
                    <td>
                      <AdminEditButton props={`/admin/accounts/edit/${user.id}`}/>
                      <DeleteAccount user={user} />
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

        {/* Manajemen Admin */}
      </div>
    </>
  );
}
