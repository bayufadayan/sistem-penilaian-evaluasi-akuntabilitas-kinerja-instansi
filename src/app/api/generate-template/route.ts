import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createActivityLog } from "@/lib/activityLog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";

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

    // Buat Data EvaluationSheet
    const now = new Date();
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(now.getMonth() + 3);
    const evaluationSheet = await prisma.evaluationSheet.create({
      data: {
        title: `LKE AKIP BPMSPH ${now.getFullYear()}`,
        date_start: now,
        date_finish: threeMonthsLater,
        description: "",
        status: "PENDING",
        year: String(now.getFullYear()),
      },
    });

    await prisma.evaluationSheetScore.create({
      data: {
        nilai: null,
        grade: null,
        id_LKE: evaluationSheet.id,
      },
    });

    // Data Components
    const componentsData = [
      {
        name: "PERENCANAAN KINERJA",
        description: "Diisi oleh Divisi A",
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
        const createdComponent = await prisma.component.create({
          data: { ...comp, id_LKE: evaluationSheet.id },
        });

        // Buat componentScore untuk component yang baru dibuat
        await prisma.componentScore.create({
          data: {
            nilai: null,
            id_components: createdComponent.id,
          },
        });

        return createdComponent;
      })
    );

    // Data SubComponents
    const subcomponentsData: Record<
      number,
      {
        name: string;
        description: string;
        weight: number;
        subcomponent_number: number;
      }[]
    > = {
      1: [
        {
          name: "Dokumen Perencanaan kinerja telah tersedia",
          description: "",
          weight: 6,
          subcomponent_number: 1,
        },
        {
          name: "Dokumen Perencanaan kinerja telah memenuhi standar yang baik, yaitu untuk mencapai hasil, dengan ukuran kinerja yang SMART, menggunakan penyelarasan (cascading) disetiap level secara logis, serta memperhatikan kinerja bidang lain (crosscutting)",
          description: "",
          weight: 9,
          subcomponent_number: 2,
        },
        {
          name: "Perencanaan Kinerja telah dimanfaatkan untuk mewujudkan hasil yang berkesinambungan",
          description: "",
          weight: 15,
          subcomponent_number: 3,
        },
      ],
      2: [
        {
          name: "Pengukuran Kinerja telah dilakukan",
          description: "",
          weight: 6,
          subcomponent_number: 1,
        },
        {
          name: "Pengukuran Kinerja telah menjadi kebutuhan dalam mewujudkan Kinerja secara Efektif dan Efisien dan telah dilakukan secara berjenjang dan berkelanjutan",
          description: "",
          weight: 9,
          subcomponent_number: 2,
        },
        {
          name: "Pengukuran Kinerja telah dijadikan dasar dalam pemberian Reward dan Punishment, serta penyesuaian strategi dalam mencapai kinerja yang efektif dan efisien",
          description: "",
          weight: 15,
          subcomponent_number: 3,
        },
      ],
      3: [
        {
          name: "Terdapat Dokumen Laporan yang menggambarkan Kinerja",
          description: "",
          weight: 3,
          subcomponent_number: 1,
        },
        {
          name: "Dokumen Laporan Kinerja telah memenuhi Standar menggambarkan Kualitas atas Pencapaian Kinerja, informasi keberhasilan/kegagalan kinerja serta upaya perbaikan/penyempurnaannya",
          description: "",
          weight: 4.5,
          subcomponent_number: 2,
        },
        {
          name: "Pelaporan Kinerja telah memberikan dampak yang besar dalam penyesuaian strategi/kebijakan dalam mencapai kinerja berikutnya",
          description: "",
          weight: 7.5,
          subcomponent_number: 3,
        },
      ],
      4: [
        {
          name: "Evaluasi Akuntabilitas Kinerja Internal telah dilaksanakan",
          description: "",
          weight: 5,
          subcomponent_number: 1,
        },
        {
          name: "Evaluasi Akuntabilitas Kinerja Internal telah dilaksanakan secara berkualitas dengan Sumber Daya yang memadai",
          description: "",
          weight: 7.5,
          subcomponent_number: 2,
        },
        {
          name: "Implementasi SAKIP telah meningkat karena evaluasi Akuntabilitas Kinerja Internal sehingga memberikan kesan yang nyata (dampak) dalam efektifitas dan efisiensi Kinerja",
          description: "",
          weight: 12.5,
          subcomponent_number: 3,
        },
      ],
    };

    const subcomponents = await Promise.all(
      components.map(async (component) => {
        const subData = subcomponentsData[component.component_number] || [];
        return Promise.all(
          subData.map(async (sub) => {
            const createdSubComponent = await prisma.subComponent.create({
              data: { ...sub, id_components: component.id },
            });

            // Buat subComponentScore untuk subcomponent yang baru dibuat
            await prisma.subComponentScore.create({
              data: {
                nilaiAvgOlah: null,
                nilai: null,
                persentase: null,
                grade: null,
                id_subcomponents: createdSubComponent.id,
              },
            });

            return createdSubComponent;
          })
        );
      })
    );

    // Data Kriteria
    const criteriaData: Record<
      number,
      Record<
        number,
        { name: string; description: string; criteria_number: number }[]
      >
    > = {
      1: {
        1: [
          {
            name: "Terdapat pedoman teknis perencanaan kinerja.",
            description: "",
            criteria_number: 1,
          },
          {
            name: "Terdapat dokumen perencanaan kinerja jangka panjang.",
            description: "",
            criteria_number: 2,
          },
          {
            name: "Terdapat dokumen perencanaan kinerja jangka menengah.",
            description: "",
            criteria_number: 3,
          },
          {
            name: "Terdapat dokumen perencanaan kinerja jangka pendek.",
            description: "",
            criteria_number: 4,
          },
          {
            name: "Terdapat dokumen perencanaan aktivitas yang mendukung kinerja.",
            description: "",
            criteria_number: 5,
          },
          {
            name: "Terdapat dokumen perencanaan anggaran yang mendukung kinerja.",
            description: "",
            criteria_number: 6,
          },
          {
            name: "Setiap unit/satuan kerja merumuskan dan menetapkan Perencanaan Kinerja.",
            description: "",
            criteria_number: 7,
          },
        ],
        2: [
          {
            name: "Dokumen Perencanaan Kinerja telah diformalkan.",
            description: "",
            criteria_number: 1,
          },
          {
            name: "Dokumen Perencanaan Kinerja telah dipublikasikan tepat waktu.",
            description: "",
            criteria_number: 2,
          },
          {
            name: "Dokumen Perencanaan Kinerja telah menggambarkan Kebutuhan atas Kinerja sebenarnya yang perlu dicapai.",
            description: "",
            criteria_number: 3,
          },
          {
            name: "Kualitas Rumusan Hasil (Tujuan/Sasaran) telah jelas menggambarkan kondisi kinerja yang akan dicapai.",
            description: "",
            criteria_number: 4,
          },
          {
            name: "Ukuran Keberhasilan (Indikator Kinerja) telah memenuhi kriteria SMART.",
            description: "",
            criteria_number: 5,
          },
          {
            name: "Indikator Kinerja Utama (IKU) telah menggambarkan kondisi Kinerja Utama yang harus dicapai, tertuang secara berkelanjutan (sustainable - tidak sering diganti dalam 1 periode Perencanaan Strategis).",
            description: "",
            criteria_number: 6,
          },
          {
            name: "Target yang ditetapkan dalam Perencanaan Kinerja dapat dicapai (achievable), menantang, dan realistis.",
            description: "",
            criteria_number: 7,
          },
          {
            name: "Setiap Dokumen Perencanaan Kinerja menggambarkan hubungan yang berkesinambungan, serta selaras antara Kondisi/Hasil yang akan dicapai di setiap level jabatan (Cascading).",
            description: "",
            criteria_number: 8,
          },
          {
            name: "Perencanaan kinerja dapat memberikan informasi tentang hubungan kinerja, strategi, kebijakan, bahkan aktivitas antar bidang/dengan tugas dan fungsi lain yang berkaitan (Crosscutting).",
            description: "",
            criteria_number: 9,
          },
        ],
        3: [
          {
            name: "Anggaran yang ditetapkan telah mengacu pada Kinerja yang ingin dicapai.",
            description: "",
            criteria_number: 1,
          },
          {
            name: "Aktivitas yang dilaksanakan telah mendukung Kinerja yang ingin dicapai.",
            description: "",
            criteria_number: 2,
          },
          {
            name: "Rencana aksi kinerja dapat berjalan dinamis karena capaian kinerja selalu dipantau secara berkala.",
            description: "",
            criteria_number: 3,
          },
          {
            name: "Terdapat perbaikan/penyempurnaan Dokumen Perencanaan Kinerja yang ditetapkan dari hasil analisis perbaikan kinerja sebelumnya.",
            description: "",
            criteria_number: 4,
          },
          {
            name: "Terdapat perbaikan/penyempurnaan Dokumen Perencanaan Kinerja dalam mewujudkan kondisi/hasil yang lebih baik.",
            description: "",
            criteria_number: 5,
          },
          {
            name: "Setiap unit/satuan kerjan berkomitmen dalam mencapai kinerja yang telah direncanakan.",
            description: "",
            criteria_number: 6,
          },
          {
            name: "Pimpinan terlibat dalam mencapai kinerja yang telah direncanakan.",
            description: "",
            criteria_number: 7,
          },
          {
            name: "Setiap Pegawai berkomitmen dalam mencapai kinerja yang telah direncanakan.",
            description: "",
            criteria_number: 8,
          },
          {
            name: "Kinerja individu telah selaras dengan kinerja organisasi.",
            description: "",
            criteria_number: 9,
          },
        ],
      },
      2: {
        1: [
          {
            name: "Terdapat pedoman teknis pengukuran kinerja dan pengumpulan data kinerja.",
            description: "",
            criteria_number: 1,
          },
          {
            name: "Terdapat Definisi Operasional yang jelas atas kinerja dan cara mengukur indikator kinerja.",
            description: "",
            criteria_number: 2,
          },
          {
            name: "Terdapat mekanisme yang jelas terhadap pengumpulan data kinerja yang dapat diandalkan.",
            description: "",
            criteria_number: 3,
          },
        ],
        2: [
          {
            name: "Data kinerja yang dikumpulkan telah relevan untuk mengukur capaian kinerja yang diharapkan.",
            description: "",
            criteria_number: 1,
          },
          {
            name: "Data kinerja yang dikumpulkan telah mendukung capaian kinerja yang diharapkan.",
            description: "",
            criteria_number: 2,
          },
          {
            name: "Pengukuran kinerja telah dilakukan secara berkala.",
            description: "",
            criteria_number: 3,
          },
          {
            name: "Setiap level organisasi melakukan pemantauan atas pengukuran capaian kinerja unit dibawahnya secara berjenjang.",
            description: "",
            criteria_number: 4,
          },
          {
            name: "Pengumpulan data kinerja dan pengukuran capaian kinerja telah memanfaatkan Teknologi Informasi (Aplikasi).",
            description: "",
            criteria_number: 5,
          },
        ],
        3: [
          {
            name: "Pimpinan selalu teribat sebagai pengambil keputusan (Decision Maker) dalam mengukur capaian kinerja.",
            description: "",
            criteria_number: 1,
          },
          {
            name: "Pengukuran Kinerja telah menjadi dasar dalam penyesuaian (pemberian/pengurangan) tunjangan kinerja/penghasilan.",
            description: "",
            criteria_number: 2,
          },
          {
            name: "Pengukuran Kinerja telah menjadi dasar dalam penempatan/penghapusan Jabatan baik struktural maupun fungsional.",
            description: "",
            criteria_number: 3,
          },
          {
            name: "Pengukuran kinerja telah mempengaruhi penyesuaian (Refocusing) Organisasi.",
            description: "",
            criteria_number: 4,
          },
          {
            name: "Pengukuran kinerja telah mempengaruhi penyesuaian Strategi dalam mencapai kinerja.",
            description: "",
            criteria_number: 5,
          },
          {
            name: "Pengukuran kinerja telah mempengaruhi penyesuaian Kebijakan dalam mencapai kinerja.",
            description: "",
            criteria_number: 6,
          },
          {
            name: "Pengukuran kinerja telah mempengaruhi penyesuaian Aktivitas dalam mencapai kinerja.",
            description: "",
            criteria_number: 7,
          },
          {
            name: "Pengukuran kinerja telah mempengaruhi penyesuaian Anggaran dalam mencapai kinerja.",
            description: "",
            criteria_number: 8,
          },
          {
            name: "Terdapat efisiensi atas penggunaan anggaran dalam mencapai kinerja.",
            description: "",
            criteria_number: 9,
          },
          {
            name: "Setiap unit/satuan kerja memahami dan peduli atas hasil pengukuran kinerja.",
            description: "",
            criteria_number: 10,
          },
          {
            name: "Setiap pegawai memahami dan peduli atas hasil pengukuran kinerja.",
            description: "",
            criteria_number: 11,
          },
        ],
      },
      3: {
        1: [
          {
            name: "Dokumen Laporan Kinerja telah disusun.",
            description: "",
            criteria_number: 1,
          },
          {
            name: "Dokumen Laporan Kinerja telah disusun secara berkala.",
            description: "",
            criteria_number: 2,
          },
          {
            name: "Dokumen Laporan Kinerja telah direviu.",
            description: "",
            criteria_number: 3,
          },
          {
            name: "Dokumen Laporan Kinerja telah dipublikasikan.",
            description: "",
            criteria_number: 4,
          },
          {
            name: "Dokumen Laporan Kinerja telah disampaikan tepat waktu.",
            description: "",
            criteria_number: 5,
          },
        ],
        2: [
          {
            name: "Dokumen Laporan Kinerja telah diformalkan.",
            description: "",
            criteria_number: 1,
          },
          {
            name: "Dokumen Laporan Kinerja disusun secara berkualitas sesuai dengan standar.",
            description: "",
            criteria_number: 2,
          },
          {
            name: "Dokumen Laporan Kinerja telah mengungkap seluruh informasi tentang pencapaian kinerja.",
            description: "",
            criteria_number: 3,
          },
          {
            name: "Dokumen Laporan Kinerja telah menginfokan analisis dan evaluasi realisasi kinerja dengan target tahunan.",
            description: "",
            criteria_number: 4,
          },
          {
            name: "Dokumen Laporan Kinerja telah menginfokan analisis dan evaluasi realisasi kinerja dengan target jangka menengah.",
            description: "",
            criteria_number: 5,
          },
          {
            name: "Dokumen Laporan Kinerja telah menginfokan analisis dan evaluasi realisasi kinerja dengan realisasi kinerja tahun-tahun sebelumnya.",
            description: "",
            criteria_number: 6,
          },
          {
            name: "Dokumen Laporan Kinerja telah menginfokan analisis dan evaluasi realisasi kinerja dengan realiasi kinerja di level nasional/internasional (Benchmark Kinerja).",
            description: "",
            criteria_number: 7,
          },
          {
            name: "Dokumen Laporan Kinerja telah menginfokan detail kinerja dalam keberhasilan/kegagalan mencapai target kinerja.",
            description: "",
            criteria_number: 8,
          },
          {
            name: "Dokumen Laporan Kinerja telah menginfokan kualitas atas keberhasilan/kegagalan mencapai target kinerja beserta upaya nyata dan/atau hambatannya.",
            description: "",
            criteria_number: 9,
          },
          {
            name: "Dokumen Laporan Kinerja telah menginfokan efisiensi atas penggunaan sumber daya dalam mencapai kinerja.",
            description: "",
            criteria_number: 10,
          },
          {
            name: "Dokumen Laporan Kinerja telah menginfokan upaya perbaikan dan penyempurnaan kinerja ke depan (Rekomendasi perbaikan kinerja).",
            description: "",
            criteria_number: 11,
          },
        ],
        3: [
          {
            name: "Informasi dalam laporan kinerja selalu menjadi perhatian utama pimpinan (Bertanggung Jawab).",
            description: "",
            criteria_number: 1,
          },
          {
            name: "Penyajian informasi dalam laporan kinerja menjadi kepedulian seluruh pegawai.",
            description: "",
            criteria_number: 2,
          },
          {
            name: "Informasi dalam laporan kinerja berkala telah digunakan dalam penyesuaian aktivitas untuk mencapai kinerja.",
            description: "",
            criteria_number: 3,
          },
          {
            name: "Informasi dalam laporan kinerja berkala telah digunakan dalam penyesuaian penggunaan anggaran untuk mencapai kinerja.",
            description: "",
            criteria_number: 4,
          },
          {
            name: "Informasi dalam laporan kinerja telah digunakan dalam evaluasi pencapaian keberhasilan kinerja.",
            description: "",
            criteria_number: 5,
          },
          {
            name: "Informasi dalam laporan kinerja telah digunakan dalam penyesuaian perencanaan kinerja yang akan dihadapi berikutnya.",
            description: "",
            criteria_number: 6,
          },
          {
            name: "Informasi dalam laporan kinerja selalu mempengaruhi perubahan budaya kinerja organisasi.",
            description: "",
            criteria_number: 7,
          },
        ],
      },
      4: {
        1: [
          {
            name: "Terdapat pedoman teknis Evaluasi Akuntabilitas Kinerja Internal.",
            description: "",
            criteria_number: 1,
          },
          {
            name: "Evaluasi Akuntabilitas Kinerja Internal telah dilaksanakan pada seluruh unit kerja/perangkat daerah.",
            description: "",
            criteria_number: 2,
          },
          {
            name: "Evaluasi Akuntabilitas Kinerja Internal telah dilaksanakan secara berjenjang.",
            description: "",
            criteria_number: 3,
          },
        ],
        2: [
          {
            name: "Evaluasi Akuntabilitas Kinerja Internal telah dilaksanakan sesuai standar.",
            description: "",
            criteria_number: 1,
          },
          {
            name: "Evaluasi Akuntabilitas Kinerja Internal telah dilaksanakan oleh SDM yang memadai.",
            description: "",
            criteria_number: 2,
          },
          {
            name: "Evaluasi Akuntabilitas Kinerja Internal telah dilaksanakan dengan pendalaman yang memadai.",
            description: "",
            criteria_number: 3,
          },
          {
            name: "Evaluasi Akuntabilitas Kinerja Internal telah dilaksanakan pada seluruh unit kerja/perangkat daerah.",
            description: "",
            criteria_number: 4,
          },
          {
            name: "Evaluasi Akuntabilitas Kinerja Internal telah dilaksanakan menggunakan Teknologi Informasi (Aplikasi).",
            description: "",
            criteria_number: 5,
          },
        ],
        3: [
          {
            name: "Seluruh rekomendasi atas hasil evaluasi akuntablitas kinerja internal telah ditindaklanjuti.",
            description: "",
            criteria_number: 1,
          },
          {
            name: "Telah terjadi peningkatan implementasi SAKIP dengan melaksanakan tindak lanjut atas rerkomendasi hasil evaluasi akuntablitas Kinerja internal.",
            description: "",
            criteria_number: 2,
          },
          {
            name: "Hasil Evaluasi Akuntabilitas Kinerja Internal telah dimanfaatkan untuk perbaikan dan peningkatan akuntabilitas kinerja.",
            description: "",
            criteria_number: 3,
          },
          {
            name: "Hasil dari Evaluasi Akuntabilitas Kinerja Internal telah dimanfaatkan dalam mendukung efektifitas dan efisiensi kinerja.",
            description: "",
            criteria_number: 4,
          },
          {
            name: "Telah terjadi perbaikan dan peningkatan kinerja dengan memanfaatkan hasil evaluasi akuntablitas kinerja internal.",
            description: "",
            criteria_number: 5,
          },
        ],
      },
    };

    const criteria = await Promise.all(
      components.map(async (component) => {
        const componentData = criteriaData[component.component_number];

        if (!componentData) {
          console.error(
            `No criteria data found for component_number: ${component.component_number}`
          );
          return null;
        }

        return Promise.all(
          Object.keys(componentData).map(async (subcomponent_number) => {
            const subcomponent = await prisma.subComponent.findFirst({
              where: {
                id_components: component.id,
                subcomponent_number: parseInt(subcomponent_number),
              },
            });

            if (!subcomponent) {
              console.error(
                `Subcomponent not found for component_number: ${component.component_number}, subcomponent_number: ${subcomponent_number}`
              );
              return null;
            }

            const criteriaData = componentData[parseInt(subcomponent_number)];

            return Promise.all(
              criteriaData.map(async (crit) => {
                // Membuat kriteria untuk setiap subkomponen
                const createdCriteria = await prisma.criteria.create({
                  data: {
                    name: crit.name,
                    description: crit.description || null,
                    criteria_number: crit.criteria_number || 0,
                    id_subcomponents: subcomponent.id,
                  },
                });

                // Membuat skor untuk setiap kriteria
                await prisma.score.create({
                  data: {
                    score: "",
                    id_criterias: createdCriteria.id,
                    id_users: null,
                    notes: null,
                  },
                });

                return createdCriteria;
              })
            );
          })
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
    console.error("Error generating evaluation sheet:", error);
    return NextResponse.json({ error: "Failed to generate" }, { status: 500 });
  }
};
