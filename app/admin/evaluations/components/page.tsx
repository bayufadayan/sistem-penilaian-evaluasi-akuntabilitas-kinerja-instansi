import AdminNavbar from "../../components/adminNavbar";
import AdminSidebar from "../../components/adminSidebar";
import AddComponents from "./addComponents";
import UpdateComponent from "./updateComponents";
import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import DeleteComponent from "./deleteComponents";

const getComponents = async () => {
  const res = await prisma.component.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      weight: true,
    },
  });
  return res;
};

export default async function ManagementAccountPage() {
  const [components] = await Promise.all([getComponents()]);

  return (
    <>
      {console.log(components)}
      <AdminNavbar />
      <AdminSidebar />

      {/* content nya */}
      <div className="p-8 ml-64 mt-14">
        {/* Breadcrumb */}
        <div className="mb-4 text-gray-500">
          <Link href="#" className="text-blue-600">
            Dashboard
          </Link>{" "}
          / Manajemen Komponen
        </div>

        {/* Manajemen User Bang */}
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-2xl font-semibold mb-4">Manajemen Tim</h1>

          <AddComponents components={components}/>
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
            {components.length > 0 ? (
              <tbody>
                {components.map((component, index) => (
                  <tr className="border-b" key={component.id}>
                    <td className="py-4">{index + 1}</td>
                    <td className="">{component.name.toUpperCase()}</td>
                    <td className="">{component.description}</td>
                    <td className="">{component.weight}</td>
                    <td>
                      <span className="flex items-stretch justify-start space-x-0">
                      <UpdateComponent component={component}/>
                        <DeleteComponent component={component}/>
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
