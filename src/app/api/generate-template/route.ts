import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createActivityLog } from "@/lib/activityLog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export const POST = async () => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );
    }

    // Data EvaluationSheet
    const now = new Date();
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(now.getMonth() + 3);
    const evaluationSheet = await prisma.evaluationSheet.create({
      data: {
        title: `LKE AKIP BPMSPH ${now.getFullYear()}`,
        date_start: now,
        date_finish: threeMonthsLater,
        description: "",
        status: "IN_PROGRESS",
        year: String(now.getFullYear()),
      },
    });

    // Data Components
    const componentsData = [
      {
        name: "PERENCANAAN KINERJA",
        description: "",
        weight: 30,
        component_number: 1,
        id_team: 1,
      },
      {
        name: "PENGUKURAN KINERJA",
        description: "",
        weight: 30,
        component_number: 2,
        id_team: 1,
      },
      {
        name: "PELAPORAN KINERJA",
        description: "",
        weight: 15,
        component_number: 3,
        id_team: 1,
      },
      {
        name: "EVALUASI AKUNTABILITAS KINERJA INTERNAL",
        description: "",
        weight: 25,
        component_number: 4,
        id_team: 1,
      },
    ];

    const components = await Promise.all(
      componentsData.map(async (comp) => {
        return prisma.component.create({
          data: { ...comp, id_LKE: evaluationSheet.id },
        });
      })
    );

    // Data SubComponents
    const subcomponentsData: Record<
      number,
      { name: string; description: string; weight: number }[]
    > = {
      1: [
        {
          name: "DOKUMEN PERENCANAAN KINERJA TELAH TERSEDIA",
          description: "",
          weight: 6,
        },
        {
          name: "DOKUMEN PERENCANAAN KINERJA TELAH MEMENUHI STANDAR YANG BAIK",
          description: "",
          weight: 9,
        },
        {
          name: "PERENCANAAN KINERJA TELAH DIMANFAATKAN UNTUK MEWUJUDKAN HASIL YANG BERKESINAMBUNGAN",
          description: "tes deskripsi",
          weight: 15,
        },
      ],
      2: [
        {
          name: "PENGUKURAN KINERJA TELAH DILAKUKAN",
          description: "",
          weight: 6,
        },
        {
          name: "PENGUKURAN KINERJA TELAH MENJADI KEBUTUHAN DALAM MEWUJUDKAN KINERJA",
          description: "",
          weight: 9,
        },
        {
          name: "PENGUKURAN KINERJA TELAH DIJADIKAN DASAR DALAM PEMBERIAN REWARD DAN PUNISHMENT",
          description: "",
          weight: 15,
        },
      ],
    };

    const subcomponents = await Promise.all(
      components.map(async (component) => {
        const subData = subcomponentsData[component.component_number] || [];
        return Promise.all(
          subData.map((sub) =>
            prisma.subComponent.create({
              data: { ...sub, id_components: component.id },
            })
          )
        );
      })
    );

    // Fungsi untuk Generate Data Kriteria Dummy
    const generateCriteriaData = (subcomponentId: number) => {
      return [
        {
          name: `KRITERIA 1 UNTUK SUB ID ${subcomponentId}`,
          description: `Deskripsi kriteria 1 untuk subcomponent ${subcomponentId}`,
        },
        {
          name: `KRITERIA 2 UNTUK SUB ID ${subcomponentId}`,
          description: `Deskripsi kriteria 2 untuk subcomponent ${subcomponentId}`,
        },
        {
          name: `KRITERIA 3 UNTUK SUB ID ${subcomponentId}`,
          description: `Deskripsi kriteria 3 untuk subcomponent ${subcomponentId}`,
        },
      ];
    };

    // Data Criteria
    const criteria = await Promise.all(
      subcomponents.flat().map(async (sub) => {
        const criteriaData = generateCriteriaData(sub.id);
        return Promise.all(
          criteriaData.map((crit) =>
            prisma.criteria.create({
              data: { ...crit, id_subcomponents: sub.id },
            })
          )
        );
      })
    );

    // Log Aktivitas
    const activityLog = createActivityLog(
      "Template LKE AKIP berhasil digenerate",
      "System",
      0,
      Number(session.user.id)
    );

    return NextResponse.json(
      { evaluationSheet, components, subcomponents, criteria, activityLog },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate" }, { status: 500 });
  }
};
