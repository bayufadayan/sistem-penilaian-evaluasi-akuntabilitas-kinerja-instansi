import dynamic from "next/dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { FiExternalLink, FiBarChart2, FiPieChart } from "react-icons/fi";;
import { TiHome } from "react-icons/ti";
import { IoIosArrowForward } from "react-icons/io";

const AddComponents = dynamic(() => import("./addComponents"), { ssr: false });
const UpdateComponent = dynamic(() => import("./updateComponents"), { ssr: false });
const DeleteComponent = dynamic(() => import("./deleteComponents"), { ssr: false });
const SubComponentLink = dynamic(() => import("./subComponenLink"), { ssr: false });
const UploadExcel = dynamic(() => import("./uploadExcel"), { ssr: false });

const getComponents = async (id: string) => {
  const res = await prisma.component.findMany({
    where: {
      id_LKE: id,
    },
    select: {
      id: true,
      name: true,
      description: true,
      weight: true,
      component_number: true,
      id_team: true,
      id_LKE: true,
      team: {
        select: {
          name: true,
        },
      },
      evaluation: {
        select: {
          title: true,
        },
      },
      subComponents: true,
    },
  });
  return res;
};

const getTeams = async () => {
  const res = await prisma.team.findMany();
  return res;
};

const getEvaluationSheetById = async (id: string) => {
  const res = await prisma.evaluationSheet.findUnique({
    where: {
      id: id,
    },
    select: {
      title: true,
    },
  });
  return res;
};

export default async function ManagementAccountPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const [components, teams, evaluationSheets] = await Promise.all([
    getComponents(id),
    getTeams(),
    getEvaluationSheetById(id),
  ]);

  components.sort((a, b) => a.component_number - b.component_number);

  const totalBobot = components.reduce(
    (acc, component) => acc + component.weight,
    0
  );

  return (
    <>
      <div>
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
          <span>Komponen</span>
        </div>

        <h1 className="text-2xl font-semibold mb-2">
          Manajemen Komponen ({evaluationSheets?.title || "Loading..."})
        </h1>

        <div className="grid grid-cols-2 gap-6 mb-4">
          <div className="p-5 bg-white rounded-lg shadow-lg flex items-center justify-between border-l-4 border-green-600">
            <div>
              <h2 className="text-md font-bold text-green-600 mb-2">
                Jumlah Komponen
              </h2>
              <p className="text-3xl font-bold text-green-600">
                {components.length}
              </p>
            </div>
            <FiBarChart2 className="text-green-600 w-12 h-12" />
          </div>

          <div className="p-5 bg-white rounded-lg shadow-lg flex items-center justify-between border-l-4 border-yellow-600">
            <div>
              <h2 className="text-md font-bold text-yellow-600 mb-2">
                Total Bobot
              </h2>
              <p className="text-3xl font-bold text-yellow-600">
                {totalBobot.toFixed(2)}
              </p>
            </div>
            <FiPieChart className="text-yellow-600 w-12 h-12" />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 ">
          <AddComponents teams={teams} id_LKE={id} />
          <UploadExcel id_LKE={id} />
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="py-2 pe-8 w-44">
                  <FiExternalLink className="w-5 h-5 text-gray-600" />
                </th>
                <th className="py-2 w-52 px-4">NAMA KOMPONEN</th>
                <th className="py-2">DESKIPSI</th>
                <th className="py-2">BOBOT</th>
                <th className="py-2">TIM</th>
                <th className="py-2">AKSI</th>
              </tr>
            </thead>
            {components.length > 0 ? (
              <tbody>
                {components.map((component) => (
                  <tr className="border-b" key={component.id}>
                    <td className="py-4">
                      <SubComponentLink
                        componentId={component.id}
                        length={component.subComponents.length}
                      />
                    </td>
                    <td className="px-4">{component.name.toUpperCase()}</td>
                    <td className="text-green-600">
                      {component.description === ""
                        ? "Tidak Ada Deskripsi"
                        : component.description}
                    </td>
                    <td className="py-2">{component.weight.toFixed(1)}</td>
                    <td className="py-2">
                      {component.team?.name || "Tidak Ditemukan"}
                    </td>
                    <td>
                      <span className="flex items-stretch justify-start space-x-0">
                        <UpdateComponent component={component} teams={teams} />
                        <DeleteComponent component={component} />
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
