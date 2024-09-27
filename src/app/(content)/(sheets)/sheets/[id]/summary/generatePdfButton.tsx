import type React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  section: {
    marginBottom: 10,
  },
  componentTitle: {
    fontSize: 14,
    marginBottom: 5,
  },
  tableHeader: {
    backgroundColor: "#eeeeee",
    padding: 4,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
  },
  cell: {
    padding: 4,
    flexGrow: 1,
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
}

const EvaluationReportPDF: React.FC<EvaluationReportProps> = ({
  components,
  evaluationName,
}) => (
  <Document>
    <Page style={styles.page}>
      <Text
        style={styles.title}
      >{`Laporan Evaluasi Detail - ${evaluationName}`}</Text>

      {components.map((component, index) => (
        <View key={component.id} style={styles.section}>
          <Text style={styles.componentTitle}>{`Komponen ${index + 1}: ${
            component.name
          }`}</Text>

          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.cell}>Sub Komponen</Text>
            <Text style={styles.cell}>Kriteria</Text>
            <Text style={styles.cell}>Deskripsi Kriteria</Text>
            <Text style={styles.cell}>No Kriteria</Text>
          </View>

          {component.subComponents.map((subComponent) => (
            <View key={subComponent.id}>
              {subComponent.criteria.map((criteria) => (
                <View style={styles.tableRow} key={criteria.id}>
                  <Text style={styles.cell}>{subComponent.name}</Text>
                  <Text style={styles.cell}>{criteria.name}</Text>
                  <Text style={styles.cell}>{criteria.description || "-"}</Text>
                  <Text style={styles.cell}>{criteria.criteria_number}</Text>
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
