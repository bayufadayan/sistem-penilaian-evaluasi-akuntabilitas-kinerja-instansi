// /* eslint-disable jsx-a11y/alt-text */
// import type React from "react";
// import {
//   Page,
//   Text,
//   View,
//   Document,
//   PDFDownloadLink,
//   StyleSheet,
//   Image,
//   Font,
// } from "@react-pdf/renderer";

// Font.register({
//   family: "Times New Roman",
//   fonts: [
//     { src: "/fonts/times new roman.ttf", fontWeight: "normal" },
//     { src: "/fonts/times new roman bold.ttf", fontWeight: "bold" },
//     { src: "/fonts/times new roman italic.ttf", fontStyle: "italic" },
//     {
//       src: "/fonts/times new roman bold italic.ttf",
//       fontWeight: "bold",
//       fontStyle: "italic",
//     },
//   ],
// });

// type ComponentData = {
//   id: number;
//   name: string;
//   weight: number;
//   componentScore: { nilai: number }[];
// };

// type PdfProps = {
//   components: ComponentData[];
//   totalScore: number;
//   year: number;
//   dateRange: string;
// };

// // Define styles
// const styles = StyleSheet.create({
//   page: {
//     paddingHorizontal: 15,
//     paddingVertical: 5,
//     fontFamily: "Times New Roman",
//   },
//   titleContainer: {
//     display: "flex",
//     flexDirection: "column",
//   },
//   title: {
//     fontSize: 16,
//     textAlign: "center",
//     marginVertical: 7,
//     fontWeight: "bold",
//     display: "flex",
//     gap: 5,
//   },
//   titleChild: {
//     fontWeight: "bold",
//   },
//   bodyContainer: {
//     marginVertical: 10,
//     paddingHorizontal: 35,
//   },
//   contentBody: {
//     fontSize: 12,
//     lineHeight: 1.5,
//     textAlign: "justify",
//   },
//   table: {
//     display: "flex",
//     width: "auto",
//     marginBottom: 20,
//     paddingHorizontal: 35,
//   },
//   tableRow: { flexDirection: "row" },
//   tableColHeader: {
//     width: "25%",
//     borderStyle: "solid",
//     borderWidth: 1,
//     backgroundColor: "#f0f0f0",
//     padding: 5,
//   },
//   tableCol: { width: "25%", borderStyle: "solid", borderWidth: 1, padding: 5 },
//   tableCell: { margin: 5, fontSize: 10 },
//   tableCellHeader: { margin: 5, fontSize: 10, fontWeight: "bold" },
//   kopSurat: {
//     width: 580,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: -10,
//   },
// });

// // Komponen Header PDF
// const PdfTitle: React.FC<{ year: number }> = ({ year }) => (
//   <View style={styles.titleContainer}>
//     <Image style={styles.kopSurat} src="/images/Kop BPMSPH.png" />
//     <View style={styles.title}>
//       <Text style={styles.titleChild}>HASIL AKHIR</Text>
//       <Text style={styles.titleChild}>
//         Nilai Evaluasi Akuntabilitas Kinerja BPMSPH {year}
//       </Text>
//     </View>
//   </View>
// );

// // Komponen Content PDF
// const PdfBody: React.FC<{ dateRange: string; year: number }> = ({
//   dateRange,
//   year,
// }) => (
//   <View style={styles.bodyContainer}>
//     <Text style={styles.contentBody}>
//       Berikut adalah hasil pengisian Lembar Kerja Evaluasi Akuntabilitas Kinerja
//       Instansi Pemerintah (LKE AKIP) {year} pada rentang tanggal {dateRange}.
//       Evaluasi ini memberikan gambaran tingkat akuntabilitas kinerja instansi,
//       yang diharapkan menjadi acuan dalam peningkatan kinerja dan akuntabilitas
//       di masa mendatang.
//     </Text>
//   </View>
// );

// // Komponen Header Tabel
// const PdfTableHead: React.FC = () => (
//   <View style={styles.tableRow}>
//     <View style={styles.tableColHeader}>
//       <Text style={styles.tableCellHeader}>No</Text>
//     </View>
//     <View style={styles.tableColHeader}>
//       <Text style={styles.tableCellHeader}>Nama Komponen</Text>
//     </View>
//     <View style={styles.tableColHeader}>
//       <Text style={styles.tableCellHeader}>Bobot</Text>
//     </View>
//     <View style={styles.tableColHeader}>
//       <Text style={styles.tableCellHeader}>Nilai</Text>
//     </View>
//   </View>
// );

// // Komponen Body Tabel
// const PdfTableBody: React.FC<{ components: ComponentData[] }> = ({
//   components,
// }) => (
//   <>
//     {components.map((component, index) => (
//       <View style={styles.tableRow} key={component.id}>
//         <View style={styles.tableCol}>
//           <Text style={styles.tableCell}>{index + 1}</Text>
//         </View>
//         <View style={styles.tableCol}>
//           <Text style={styles.tableCell}>{component.name}</Text>
//         </View>
//         <View style={styles.tableCol}>
//           <Text style={styles.tableCell}>{component.weight.toFixed(2)}</Text>
//         </View>
//         <View style={styles.tableCol}>
//           <Text style={styles.tableCell}>
//             {component.componentScore[0]?.nilai?.toFixed(2) ?? "N/A"}
//           </Text>
//         </View>
//       </View>
//     ))}
//   </>
// );

// // Komponen Total Tabel
// const PdfTableTotal: React.FC<{ totalScore: number }> = ({ totalScore }) => (
//   <View style={styles.tableRow}>
//     <View style={styles.tableCol} />
//     <View style={styles.tableCol}>
//       <Text style={styles.tableCell}>Nilai Akuntabilitas Kinerja</Text>
//     </View>
//     <View style={styles.tableCol} />
//     <View style={styles.tableCol}>
//       <Text style={styles.tableCell}>{totalScore.toFixed(2)}</Text>
//     </View>
//   </View>
// );

// // Dokumen PDF utama
// const PdfDocument = ({ components, totalScore, year, dateRange }: PdfProps) => (
//   <Document>
//     <Page size="A4" style={styles.page}>
//       <PdfTitle year={year} />
//       <PdfBody dateRange={dateRange} year={year}/>
//       <View style={styles.table}>
//         <PdfTableHead />
//         tes
//         <PdfTableBody components={components} />
//         <PdfTableTotal totalScore={totalScore} />
//       </View>
//     </Page>
//   </Document>
// );

// // Komponen utama untuk menampilkan tombol download PDF
// export default function PdfGenerator({
//   components,
//   totalScore,
//   year,
//   dateRange,
// }: PdfProps) {
//   return (
//     <PDFDownloadLink
//       document={
//         <PdfDocument
//           components={components}
//           totalScore={totalScore}
//           year={year}
//           dateRange = {dateRange}
//         />
//       }
//       fileName="evaluation-summary.pdf"
//       className="flex text-sm font-medium items-center bg-red-500 hover:bg-red-600 active:bg-red-700 text-white py-1 px-2 rounded shadow-md transform active:scale-95 transition-transform duration-150"
//     >
//       {({ loading }) => (loading ? "Loading..." : "Download PDF")}
//     </PDFDownloadLink>
//   );
// }
