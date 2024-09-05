import AdminNavbar from "../components/adminNavbar";
import AdminSidebar from "../components/adminSidebar";
import EditAccountPage from "./edit/[id]/page";
import DeleteAccount from "./deleteAccount";
import Link from "next/link";
import { prisma } from "../../lib/prisma";

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
    },
  });
  return res;
};

export default async function ManagementAccountPage() {
  const [users] = await Promise.all([getUsers()]);

  return (
    <>
      {console.log(users)}
      <AdminNavbar />
      <AdminSidebar />

      {/* content nya */}
      <div className="p-8 ml-64 mt-14">
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

          <Link href={"/admin/accounts/create/"}>
            <button
              type="button"
              className="flex flex-row items-center gap-1 text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <title hidden>ya</title>
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                  clipRule="evenodd"
                />
              </svg>{" "}
              <strong className="font-semibold">Tambah Akun</strong>
            </button>
          </Link>
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
                    <td>{user.id_team}</td>
                    <td>
                      <Link
                        href={`/admin/accounts/edit/${user.id}`}
                      >
                        <button
                          type="button"
                          className="mb-2 group-hover:opacity-100 focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:focus:ring-yellow-900"
                        >
                          <span className="flex gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="size-5"
                            >
                              <title hidden>te</title>
                              <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                            </svg>
                          </span>
                        </button>
                        <div className="hidden">
                        <EditAccountPage user={user}/>
                        </div>
                      </Link>

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
