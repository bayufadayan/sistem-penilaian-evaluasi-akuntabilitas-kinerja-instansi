/* eslint-disable jsx-a11y/alt-text */
import type React from "react";
import { FaFilePdf } from "react-icons/fa";
import type { ComponentScore, Score } from "@prisma/client";
import {
  Page,
  Text,
  View,
  Document,
  PDFDownloadLink,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";

Font.register({
  family: "Arial",
  fonts: [
    { src: "/fonts/ARIAL.TTF", fontWeight: "normal" },
    { src: "/fonts/ARIALBD.TTF", fontWeight: "bold" },
    { src: "/fonts/ARIALBI.TTF", fontWeight: "bold", fontStyle: "italic" },
    { src: "/fonts/ARIALI.TTF", fontStyle: "italic" },
    { src: "/fonts/ARIBLK.TTF", fontWeight: "bold" },
    {
      src: "/fonts/ArialBLACKITALIC.TTF",
      fontWeight: "bold",
      fontStyle: "italic",
    },
    { src: "/fonts/ARIALN.TTF", fontWeight: "normal" },
    { src: "/fonts/ARIALNB.TTF", fontWeight: "bold" },
    { src: "/fonts/ARIALNBI.TTF", fontWeight: "bold", fontStyle: "italic" },
    { src: "/fonts/ARIALNI.TTF", fontStyle: "italic" },
    {
      src: "/fonts/ArialCEBoldItalic.ttf",
      fontWeight: "bold",
      fontStyle: "italic",
    },
    { src: "/fonts/ArialCEItalic.ttf", fontStyle: "italic" },
    { src: "/fonts/ArialCEMTBlack.ttf", fontWeight: "bold" },
    { src: "/fonts/ArialGT.TTF", fontWeight: "normal" },
    { src: "/fonts/ArialGTTITL.TTF", fontWeight: "bold", fontStyle: "italic" },
    { src: "/fonts/ArialMT.ttf", fontWeight: "normal" },
    { src: "/fonts/ArialMdm.ttf", fontWeight: "normal" },
    { src: "/fonts/ArialMdmtl.ttf", fontStyle: "italic" },
  ],
});

// Tipe untuk detail kriteria dalam sub-komponen
type CriteriaDetails = {
  id: number;
  name: string;
  description: string;
  criteria_number: number;
  id_subcomponents: number;
  score: Score[];
};

// Tipe untuk detail sub-komponen
type SubComponentsDetail = {
  id: number;
  name: string;
  description: string;
  weight: number;
  subcomponent_number: number;
  id_components: number;
  subComponentScore: SubComponentScore[];
  criteria: CriteriaDetails[];
};

// Tipe untuk skor sub-komponen
type SubComponentScore = {
  id: number;
  nilaiAvgOlah: number;
  nilai: number;
  persentase: number;
  grade: string;
  id_subcomponents: number;
};

// Tipe untuk detail komponen
type ComponentDetail = {
  id: number;
  name: string;
  description: string;
  weight: number;
  component_number: number;
  id_team: number;
  id_LKE: string;
  componentScore: ComponentScore[];
  subComponents: SubComponentsDetail[];
};

type PdfProps = {
  components: ComponentDetail[];
  totalScore: number;
  year: number;
  dateRange: string;
  evaluationName: string;
  title: string;
  description: string;
  id: string | undefined;
  date_start: string;
  date_finish: string;
};

// Define styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "Arial",
    paddingVertical: "40px",
  },
  coverPage: {
    paddingBottom: 50,
    paddingHorizontal: 50,
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  coverBodyContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#000",
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  logoCenter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  coverTitle: {
    fontFamily: "Arial",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 7,
  },
  coverSubtitle1: {
    fontFamily: "Arial",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 40,
  },
  coverSubtitle2: {
    fontFamily: "Arial",
    fontSize: 16,
    marginBottom: 40,
    fontStyle: "italic",
  },
  coverImage: {
    width: 150,
    marginBottom: 20,
  },
  contentBody: {
    fontSize: 12,
    lineHeight: 1.5,
    textAlign: "justify",
  },
  // Hal 2
  titleContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  kopSurat: {
    width: 580,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -10,
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "left",
  },
  detailsContainer: {
    marginHorizontal: 50,
  },
  detailLeft: {
    width: "60%",
    gap: "4px",
  },
  detailRight: {
    width: "40%",
    gap: "4px",
  },
  titleDetailRow: {
    display: "flex",
    flexDirection: "row",
    paddingVertical: "4px",
    borderWidth: 2,
    borderColor: "#d9dadb",
  },
  titleDetailCol1: {
    width: "75px",
    fontWeight: "bold",
    padding: "4px",
    display: "flex",
    alignItems: "center",
  },
  titleDetailCol2: {
    width: "auto",
    padding: "4px",
    display: "flex",
    alignItems: "center",
  },
  componentContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    fontSize: 12,
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    margin: 0,
    backgroundColor: "#e6eff7",
    fontWeight: "bold"
  },
  numberCol: {
    width: "10%",
    paddingHorizontal: 2,
    paddingVertical: 2,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: "black",
    textAlign: "center",
    height: "40px",
    margin: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  componentNameCol: {
    width: "60%",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: "black",
    height: "40px",
    margin: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  componentRight: {
    width: "30%",
    flexDirection: "row",
    height: "40px",
    margin: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  componentWeightCol: {
    width: "50%",
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: "black",
    paddingHorizontal: 2,
    paddingVertical: 2,
    textAlign: "center",
    margin: 0,
    height: "40px",
  },
  componentScoreCol: {
    width: "50%",
    borderWidth: 2,
    borderColor: "black",
    paddingHorizontal: 2,
    paddingVertical: 2,
    textAlign: "center",
    margin: 0,
    height: "40px",
  },
  subComponentContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    fontSize: 12,
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    margin: 0,
  },
  subComponentNameCol: {
    width: "70%",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderLeftWidth: 2,
    borderColor: "black",
    height: "40px",
    margin: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    textAlign: "left",
  },
  subComponentWeightCol: {
    width: "50%",
    borderBottomWidth: 2,
    borderColor: "black",
    paddingHorizontal: 2,
    paddingVertical: 2,
    textAlign: "center",
    margin: 0,
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  subComponentScoreCol: {
    width: "50%",
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderLeftWidth: 2,
    borderColor: "black",
    paddingHorizontal: 2,
    paddingVertical: 2,
    textAlign: "center",
    margin: 0,
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  criterionContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    fontSize: 12,
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    margin: 0,
  },
  criterionNumber: {
    width: "10%",
    paddingHorizontal: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: "black",
    textAlign: "center",
    height: "50px",
    margin: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  criterionName: {
    width: "75%",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: "black",
    margin: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    textAlign: "left",
    height: "50px",
  },
  criterionScore: {
    width: "15%",
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderLeftWidth: 2,
    borderColor: "black",
    paddingHorizontal: 2,
    paddingVertical: 2,
    textAlign: "center",
    margin: 0,
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

// Cover component
const PdfCover: React.FC<{ year: number; dateRange: string }> = ({
  year,
  dateRange,
}) => (
  <Page size="A4" style={styles.coverPage}>
    <View style={styles.coverBodyContainer}>
      <View style={styles.logoCenter}>
        <Image style={styles.coverImage} src="/images/logo-bpmsph.png" />
      </View>
      <Text style={styles.coverTitle}>HASIL AKHIR</Text>
      <Text style={styles.coverSubtitle1}>
        Evaluasi Akuntabilitas Kinerja Instansi Pemerintah (LKE AKIP) Tahun{" "}
        {year}
      </Text>
      <Text style={styles.coverSubtitle2}>Periode: {dateRange}</Text>
    </View>
  </Page>
);
// ==================
const PdfContentHeader: React.FC = () => (
  <View style={styles.titleContainer}>
    <Image style={styles.kopSurat} src="/images/Kop BPMSPH.png" />
  </View>
);

const PdfContentDetails: React.FC<{
  year: number;
  id: string;
  title: string;
  description: string;
  dateStart: string;
  dateFinish: string;
}> = ({ year, id, title, description, dateStart, dateFinish }) => (
  <View style={styles.detailsContainer}>
    <Text style={styles.detailsTitle}>Rincian LKE AKIP {year}</Text>
    <View
      style={{
        display: "flex",
        fontSize: "12px",
        width: "100%",
        flexDirection: "row",
        gap: "8px",
        padding: "6px",
        backgroundColor: "#f7f7f7",
      }}
    >
      <View style={styles.detailLeft}>
        <View style={styles.titleDetailRow}>
          <Text style={styles.titleDetailCol1}>ID</Text>
          <Text style={{ ...styles.titleDetailCol2, color: "green" }}>
            {id}
          </Text>
        </View>
        <View style={styles.titleDetailRow}>
          <Text style={styles.titleDetailCol1}>Judul</Text>
          <Text style={styles.titleDetailCol2}>{title}</Text>
        </View>
        <View style={styles.titleDetailRow}>
          <Text style={styles.titleDetailCol1}>Deskripsi</Text>
          <Text style={styles.titleDetailCol2}>
            {description === "" ? "Tidak ada Deskripsi" : description}
          </Text>
        </View>
      </View>
      <View style={styles.detailRight}>
        <View style={styles.titleDetailRow}>
          <Text style={styles.titleDetailCol1}>Mulai</Text>
          <Text style={styles.titleDetailCol2}>{dateStart}</Text>
        </View>
        <View style={styles.titleDetailRow}>
          <Text style={styles.titleDetailCol1}>Berakhir</Text>
          <Text style={styles.titleDetailCol2}>{dateFinish}</Text>
        </View>
        <View style={styles.titleDetailRow}>
          <Text style={styles.titleDetailCol1}>Tahun</Text>
          <Text style={styles.titleDetailCol2}>2024</Text>
        </View>
      </View>
    </View>
  </View>
);

const PdfSubComponentsDetail: React.FC<{
  subComponent: SubComponentsDetail;
}> = ({ subComponent }) => (
  <View key={subComponent.id}>
    <View style={styles.subComponentContainer}>
      <View style={styles.subComponentNameCol}>
        <Text style={{ textAlign: "center" }}>
          {String.fromCharCode(64 + subComponent.subcomponent_number)}.{" "}
          {subComponent.name}
        </Text>
      </View>
      <View style={styles.componentRight}>
        <View style={styles.subComponentWeightCol}>
          <Text>{subComponent.weight}</Text>
        </View>
        <View style={styles.subComponentScoreCol}>
          <Text>
            {subComponent.subComponentScore[0].nilai} (
            {subComponent.subComponentScore[0].grade})
          </Text>
        </View>
      </View>
    </View>

    {subComponent.criteria
      .sort((a, b) => a.criteria_number - b.criteria_number)
      .map((criterion) => (
        <PdfCriteriaDetail criterion={criterion} key={criterion.id} />
      ))}
  </View>
);

const PdfCriteriaDetail: React.FC<{
  criterion: CriteriaDetails;
}> = ({ criterion }) => (
  <View style={styles.criterionContainer}>
    <View style={styles.criterionNumber}>
      <Text>{criterion.criteria_number}</Text>
    </View>
    <View style={styles.criterionName}>
      <Text>{criterion.name}</Text>
    </View>
    <View style={styles.criterionScore}>
      <Text>{criterion.score[0].score}</Text>
    </View>
  </View>
  // <Text key={criterion.id} style={{ marginLeft: 20, fontSize: 10 }}>
  //   • {criterion.name}
  // </Text>
);

const PdfComponentsDetail: React.FC<{
  year: number;
  components: ComponentDetail[];
}> = ({ year, components }) => (
  <View style={{ paddingHorizontal: 50 }}>
    <View style={{ height: "10px" }} />
    <Text style={styles.detailsTitle}>Hasil Penilaian LKE AKIP {year}</Text>
    {components
      .sort((a, b) => a.component_number - b.component_number)
      .map((component, index) => (
        <View key={component.id}>
          <View style={styles.componentContainer}>
            <View style={styles.numberCol}>
              <Text>NO</Text>
              <Text />
            </View>
            <View style={styles.componentNameCol}>
              <Text>{component.name}</Text>
              <Text />
            </View>
            <View style={styles.componentRight}>
              <View style={styles.componentWeightCol}>
                <Text>Bobot</Text>
                <Text>{component.weight}</Text>
              </View>
              <View style={styles.componentScoreCol}>
                <Text>Nilai</Text>
                <Text>{component.componentScore[0].nilai}</Text>
              </View>
            </View>
          </View>

          {component.subComponents
            .sort((a, b) => a.subcomponent_number - b.subcomponent_number)
            .map((subComponent) => (
              <PdfSubComponentsDetail
                subComponent={subComponent}
                key={subComponent.id}
              />
            ))}

          {/* Pembatas */}
          {index < components.length - 1 && (
            <View
              style={{
                height: "15px",
              }}
            />
          )}
        </View>
      ))}
  </View>
);

// Komponen halaman isi PDF
const PdfContent: React.FC<{
  components: ComponentDetail[];
  totalScore: number;
  evaluationName: string;
  year: number;
  id: string | undefined;
  description: string;
  dateStart: string;
  dateFinish: string;
}> = ({
  evaluationName,
  year,
  id,
  description,
  dateStart,
  dateFinish,
  components,
}) => (
  <Page
    size="A4"
    style={{
      ...styles.page,
      marginTop: 0,
    }}
  >
    <PdfContentHeader />
    <PdfContentDetails
      year={year}
      title={evaluationName}
      id={id || "ID Tidak Tersedia"}
      description={description}
      dateStart={dateStart}
      dateFinish={dateFinish}
    />
    <PdfComponentsDetail components={components} year={year} />
  </Page>
);

// Dokumen PDF utama
const PdfDocument = ({
  components,
  totalScore,
  evaluationName,
  year,
  dateRange,
  description,
  id,
  date_start,
  date_finish,
}: PdfProps) => (
  <Document>
    <PdfCover year={year} dateRange={dateRange} /> {/* Halaman cover */}
    <PdfContent
      components={components}
      totalScore={totalScore}
      evaluationName={evaluationName}
      year={year}
      id={id}
      description={description}
      dateFinish={date_finish}
      dateStart={date_start}
    />
  </Document>
);

export default function PdfGenerator({
  components,
  totalScore,
  evaluationName,
  year,
  dateRange,
  title,
  description,
  id,
  date_start,
  date_finish,
}: PdfProps) {
  return (
    <PDFDownloadLink
      document={
        <PdfDocument
          components={components}
          totalScore={totalScore}
          evaluationName={evaluationName}
          year={year}
          dateRange={dateRange}
          title={title}
          description={description}
          id={id}
          date_start={date_start}
          date_finish={date_finish}
        />
      }
      fileName={`Hasil Evaluasi Akuntabilitas Kinerja BPMSPH ${year}.pdf`}
      className="flex text-sm font-medium items-center bg-red-500 hover:bg-red-600 active:bg-red-700 text-white py-1 px-2 rounded shadow-md transform active:scale-95 transition-transform duration-150"
    >
      {({ loading }: { loading: boolean }) => {
        return (
          <>
            <FaFilePdf className="mr-2" />
            {loading ? "Loading..." : "Download PDF"}
          </>
        );
      }}
    </PDFDownloadLink>
  );
}
