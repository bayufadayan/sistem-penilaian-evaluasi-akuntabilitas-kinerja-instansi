import type React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  headerContainer: {
    textAlign: "center",
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
    alignSelf: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 15,
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    padding: 4,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#aaaaaa",
    fontWeight: "bold",
    fontSize: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
    fontSize: 10,
  },
  cell: {
    padding: 4,
    flex: 1,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    marginBottom: 5,
    fontWeight: "bold",
  },
});

type CriteriaData = {
  id: number;
  name: string;
  description?: string;
  criteria_number: number;
};

type SubComponentData = {
  id: number;
  name: string;
  description?: string;
  weight: number;
  subcomponent_number: number;
  criteria: CriteriaData[];
};

type ComponentData = {
  id: number;
  name: string;
  weight: number;
  componentScore: { nilai: number }[];
  subComponents: SubComponentData[];
};

interface EvaluationReportProps {
  components: ComponentData[];
  evaluationName: string;
  year: string;
}

const EvaluationReportPDF: React.FC<EvaluationReportProps> = ({
  components,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  evaluationName,
  year,
}) => (
  <Document>
    <Page style={styles.page}>
      {/* Kop Surat */}
      <View style={styles.headerContainer}>
      <Image src="/public/images/Kop BPMSPH.png" style={styles.logo} />

        <Text style={styles.title}>HASIL AKHIR</Text>
        <Text style={styles.title}>
          Nilai Lembar Kerja Evaluasi Akuntabilitas Kinerja {year}
        </Text>
      </View>

      {/* Isi Laporan */}
      {components.map((component, index) => (
        <View key={component.id} style={styles.section}>
          <Text style={styles.sectionTitle}>{`Komponen ${index + 1}: ${
            component.name
          }`}</Text>

          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.cell, { flex: 1 }]}>Sub Komponen</Text>
            <Text style={[styles.cell, { flex: 1 }]}>Kriteria</Text>
            <Text style={[styles.cell, { flex: 2 }]}>Deskripsi Kriteria</Text>
            <Text style={[styles.cell, { flex: 0.5 }]}>No Kriteria</Text>
          </View>

          {/* Table Rows */}
          {component.subComponents.map((subComponent) => (
            <View key={subComponent.id}>
              {subComponent.criteria.map((criteria) => (
                <View style={styles.tableRow} key={criteria.id}>
                  <Text style={[styles.cell, { flex: 1 }]}>
                    {subComponent.name}
                  </Text>
                  <Text style={[styles.cell, { flex: 1 }]}>
                    {criteria.name}
                  </Text>
                  <Text style={[styles.cell, { flex: 2 }]}>
                    {criteria.description || "-"}
                  </Text>
                  <Text style={[styles.cell, { flex: 0.5 }]}>
                    {criteria.criteria_number}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      ))}
    </Page>
  </Document>
);

export default EvaluationReportPDF;
