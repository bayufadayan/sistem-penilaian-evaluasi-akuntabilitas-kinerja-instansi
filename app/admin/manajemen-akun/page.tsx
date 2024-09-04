import AdminNavbar from "../components/adminNavbar";
import AdminSidebar from "../components/adminSidebar";
import Link from "next/link";

export default function ManagementAccountPage() {
  return (
    <>
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

        {/* Title */}
        <h1 className="text-2xl font-semibold mb-4">Manajemen Akun Pengguna</h1>

        {/* Tabel Konten */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="py-2">#</th>
                <th className="py-2">NAMA</th>
                <th className="py-2">NIP</th>
                <th className="py-2">STATUS</th>
                <th className="py-2">DIVISI</th>
                <th className="py-2">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {/* Google */}
              <tr className="border-b">
                <td className="py-4 flex items-center">
                  1
                </td>
                <td>3.5K</td>
                <td className="text-green-500">$5,768</td>
                <td>590</td>
                <td className="text-blue-500">4.8%</td>
              </tr>

              {/* Twitter */}
              <tr className="border-b">
                <td className="py-4 flex items-center">
                  02
                </td>
                <td>Muhamad Bayu Fadayan</td>
                <td className="text-green-500">12134567891213456789</td>
                <td className="text-red-500">Non-Aktif</td>
                <td>Pengatur Tk.1</td>
                <td>
                <button type="button" className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900">Edit</button>
                <button type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Hapus</button>

                </td>
              </tr>

              {/* Github */}
              <tr className="border-b">
                <td className="py-4 flex items-center">
                  003
                </td>
                <td>2.1K</td>
                <td className="text-green-500">$4,290</td>
                <td>420</td>
                <td className="text-blue-500">3.7%</td>
              </tr>

              {/* Vimeo */}
              <tr className="border-b">
                <td className="py-4 flex items-center">
                  4
                </td>
                <td>1.5K</td>
                <td className="text-green-500">$3,580</td>
                <td>389</td>
                <td className="text-blue-500">2.5%</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Manajemen Admin */}
        {/* Title */}
        <h1 className="text-2xl font-semibold mb-4 mt-10">Manajemen Akun Admin</h1>

        {/* Tabel Konten */}
        <div className="bg-white shadow-md rounded-lg p-6">

          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="py-2">SOURCE</th>
                <th className="py-2">VISITORS</th>
                <th className="py-2">REVENUES</th>
                <th className="py-2">SALES</th>
                <th className="py-2">CONVERSION</th>
              </tr>
            </thead>
            <tbody>
              {/* Google */}
              <tr className="border-b">
                <td className="py-4 flex items-center">
                  <img
                    src="/google.png"
                    alt="Google"
                    className="w-6 h-6 mr-3"
                  />
                  Google
                </td>
                <td>3.5K</td>
                <td className="text-green-500">$5,768</td>
                <td>590</td>
                <td className="text-blue-500">4.8%</td>
              </tr>

              {/* Twitter */}
              <tr className="border-b">
                <td className="py-4 flex items-center">
                  <img
                    src="/twitter.png"
                    alt="Twitter"
                    className="w-6 h-6 mr-3"
                  />
                  Twitter
                </td>
                <td>2.2K</td>
                <td className="text-green-500">$4,635</td>
                <td>467</td>
                <td className="text-blue-500">4.3%</td>
              </tr>

              {/* Github */}
              <tr className="border-b">
                <td className="py-4 flex items-center">
                  <img
                    src="/github.png"
                    alt="Github"
                    className="w-6 h-6 mr-3"
                  />
                  Github
                </td>
                <td>2.1K</td>
                <td className="text-green-500">$4,290</td>
                <td>420</td>
                <td className="text-blue-500">3.7%</td>
              </tr>

              {/* Vimeo */}
              <tr className="border-b">
                <td className="py-4 flex items-center">
                  <img src="/vimeo.png" alt="Vimeo" className="w-6 h-6 mr-3" />
                  Vimeo
                </td>
                <td>1.5K</td>
                <td className="text-green-500">$3,580</td>
                <td>389</td>
                <td className="text-blue-500">2.5%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
