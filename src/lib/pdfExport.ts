import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface EvaluationData {
  title: string;
  year: string;
  date_start: string | Date;
  date_finish: string | Date;
  status: string;
  description: string;
  evaluationSheetScore: Array<{
    nilai: number | null;
    grade: string | null;
  }>;
  components: Array<{
    name: string;
    weight: number;
    team: {
      name: string;
    };
    componentScore: Array<{
      nilai: number | null;
    }>;
    subComponents: Array<{
      name: string;
      weight: number;
      subComponentScore: Array<{
        nilaiAvgOlah: number | null;
        persentase: number | null;
        grade: string | null;
        nilai: number | null;
      }>;
      criteria: Array<{
        name: string;
        score: Array<{
          score: string;
          notes: string | null;
        }>;
      }>;
    }>;
  }>;
}

export const generateEvaluationPDF = async (
  evaluationData: EvaluationData
) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("LAPORAN EVALUASI", doc.internal.pageSize.getWidth() / 2, 20, {
    align: "center",
  });
  doc.text("AKUNTABILITAS KINERJA INSTANSI", doc.internal.pageSize.getWidth() / 2, 28, {
    align: "center",
  });

  // Evaluation Info
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  let yPos = 45;

  const info = [
    ["Judul Evaluasi", evaluationData.title],
    ["Tahun", evaluationData.year],
    [
      "Periode",
      `${new Date(evaluationData.date_start).toLocaleDateString("id-ID")} - ${new Date(evaluationData.date_finish).toLocaleDateString("id-ID")}`,
    ],
    ["Status", evaluationData.status],
    [
      "Nilai Akhir",
      evaluationData.evaluationSheetScore[0]?.nilai?.toString() || "-",
    ],
    ["Grade", evaluationData.evaluationSheetScore[0]?.grade || "-"],
  ];

  autoTable(doc, {
    startY: yPos,
    head: [["Informasi", "Detail"]],
    body: info,
    theme: "grid",
    styles: { fontSize: 10 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
  });

  // Component Summary
  yPos = (doc as typeof doc & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? yPos + 10;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Ringkasan Per Komponen", 14, yPos);

  const componentData = evaluationData.components.map((comp) => [
    comp.team.name,
    comp.name,
    comp.weight.toString(),
    comp.componentScore[0]?.nilai?.toFixed(2) || "-",
  ]);

  autoTable(doc, {
    startY: yPos + 5,
    head: [["Tim", "Komponen", "Bobot", "Nilai"]],
    body: componentData,
    theme: "striped",
    styles: { fontSize: 9 },
    headStyles: { fillColor: [52, 152, 219], textColor: 255 },
  });

  // SubComponent Summary (New Page)
  doc.addPage();
  yPos = 20;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Ringkasan Per Subkomponen", 14, yPos);

  const subComponentData: (string | number)[][] = [];
  evaluationData.components.forEach((comp) => {
    comp.subComponents.forEach((sub) => {
      subComponentData.push([
        comp.name,
        sub.name,
        sub.weight.toString(),
        sub.subComponentScore[0]?.nilaiAvgOlah?.toFixed(2) || "-",
        sub.subComponentScore[0]?.persentase?.toFixed(2) || "-",
        sub.subComponentScore[0]?.grade || "-",
        sub.subComponentScore[0]?.nilai?.toFixed(2) || "-",
      ]);
    });
  });

  autoTable(doc, {
    startY: yPos + 5,
    head: [
      [
        "Komponen",
        "Subkomponen",
        "Bobot",
        "Rata-rata",
        "Persentase",
        "Grade",
        "Nilai",
      ],
    ],
    body: subComponentData,
    theme: "striped",
    styles: { fontSize: 8 },
    headStyles: { fillColor: [52, 152, 219], textColor: 255 },
  });

  // Criteria Details (New Page)
  doc.addPage();
  yPos = 20;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Detail Penilaian Kriteria", 14, yPos);

  const criteriaData: string[][] = [];
  evaluationData.components.forEach((comp) => {
    comp.subComponents.forEach((sub) => {
      sub.criteria.forEach((criteria) => {
        criteriaData.push([
          comp.name,
          sub.name,
          criteria.name,
          criteria.score[0]?.score || "-",
          criteria.score[0]?.notes || "-",
        ]);
      });
    });
  });

  autoTable(doc, {
    startY: yPos + 5,
    head: [["Komponen", "Subkomponen", "Kriteria", "Skor", "Catatan"]],
    body: criteriaData,
    theme: "striped",
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [52, 152, 219], textColor: 255 },
    columnStyles: {
      4: { cellWidth: 50 },
    },
  });

  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text(
      `Halaman ${i} dari ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
    doc.text(
      `Dicetak pada: ${new Date().toLocaleString("id-ID")}`,
      14,
      doc.internal.pageSize.getHeight() - 10
    );
  }

  // Save PDF
  doc.save(
    `Evaluasi_${evaluationData.title.replace(/\s+/g, "_")}_${evaluationData.year}.pdf`
  );
};
