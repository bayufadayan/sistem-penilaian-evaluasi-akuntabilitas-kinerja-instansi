import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

export const GET = async (
  request: Request,
  context: { params: { id: string } }
) => {
  try {
    const evaluationId = context.params.id;

    // Fetch evaluation with all relations
    const evaluation = await prisma.evaluationSheet.findUnique({
      where: { id: evaluationId },
      include: {
        components: {
          include: {
            subComponents: {
              include: {
                criteria: {
                  include: {
                    score: true,
                  },
                },
                subComponentScore: true,
              },
            },
            componentScore: true,
            team: true,
          },
        },
        evaluationSheetScore: true,
      },
    });

    if (!evaluation) {
      return NextResponse.json(
        { message: "Evaluation not found" },
        { status: 404 }
      );
    }

    // Prepare data for Excel
    const workbook = XLSX.utils.book_new();

    // Sheet 1: Evaluation Info
    const evalInfo = [
      ["LAPORAN EVALUASI AKUNTABILITAS KINERJA INSTANSI"],
      [""],
      ["Judul Evaluasi", evaluation.title],
      ["Tahun", evaluation.year],
      ["Tanggal Mulai", new Date(evaluation.date_start).toLocaleDateString("id-ID")],
      ["Tanggal Selesai", new Date(evaluation.date_finish).toLocaleDateString("id-ID")],
      ["Status", evaluation.status],
      ["Nilai Akhir", evaluation.evaluationSheetScore[0]?.nilai || "-"],
      ["Grade", evaluation.evaluationSheetScore[0]?.grade || "-"],
      ["Deskripsi", evaluation.description],
    ];
    const infoSheet = XLSX.utils.aoa_to_sheet(evalInfo);
    XLSX.utils.book_append_sheet(workbook, infoSheet, "Informasi Evaluasi");

    // Sheet 2: Detailed Scores
    const scoresData: (string | number)[][] = [
      ["Komponen", "Subkomponen", "Kriteria", "Skor", "Catatan"],
    ];

    evaluation.components.forEach((component) => {
      component.subComponents.forEach((subComponent) => {
        subComponent.criteria.forEach((criteria) => {
          scoresData.push([
            component.name,
            subComponent.name,
            criteria.name,
            criteria.score[0]?.score || "-",
            criteria.score[0]?.notes || "-",
          ]);
        });
      });
    });

    const scoresSheet = XLSX.utils.aoa_to_sheet(scoresData);
    XLSX.utils.book_append_sheet(workbook, scoresSheet, "Detail Nilai");

    // Sheet 3: Component Summary
    const componentData: (string | number)[][] = [
      ["Tim", "Komponen", "Bobot", "Nilai"],
    ];

    evaluation.components.forEach((component) => {
      componentData.push([
        component.team.name,
        component.name,
        component.weight,
        component.componentScore[0]?.nilai || "-",
      ]);
    });

    const componentSheet = XLSX.utils.aoa_to_sheet(componentData);
    XLSX.utils.book_append_sheet(workbook, componentSheet, "Ringkasan Komponen");

    // Sheet 4: SubComponent Summary
    const subComponentData: (string | number)[][] = [
      ["Komponen", "Subkomponen", "Bobot", "Rata-rata Olah", "Persentase", "Grade", "Nilai"],
    ];

    evaluation.components.forEach((component) => {
      component.subComponents.forEach((subComponent) => {
        subComponentData.push([
          component.name,
          subComponent.name,
          subComponent.weight,
          subComponent.subComponentScore[0]?.nilaiAvgOlah || "-",
          subComponent.subComponentScore[0]?.persentase || "-",
          subComponent.subComponentScore[0]?.grade || "-",
          subComponent.subComponentScore[0]?.nilai || "-",
        ]);
      });
    });

    const subComponentSheet = XLSX.utils.aoa_to_sheet(subComponentData);
    XLSX.utils.book_append_sheet(workbook, subComponentSheet, "Ringkasan Subkomponen");

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    // Return as downloadable file
    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="Evaluasi_${evaluation.title.replace(/\s+/g, "_")}_${evaluation.year}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("Error generating Excel:", error);
    return NextResponse.json(
      { message: "Failed to generate Excel file" },
      { status: 500 }
    );
  }
};
