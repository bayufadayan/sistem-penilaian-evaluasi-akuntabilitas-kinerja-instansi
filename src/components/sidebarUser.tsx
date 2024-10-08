import Link from "next/link";
import ComponentCard from "./component";
import styles from "@/styles/styles.module.css";
import type { Component } from "@prisma/client";

type ComponentWithSubComponents = Component & {
  subComponents: SubComponent[];
};

interface SubComponent {
  id: number;
  name: string;
  description: string;
  weight: number;
  subcomponent_number: number;
}

export default function SidebarUser({
  components,
  evaluationTitle,
  evaluationId,
}: {
  components: ComponentWithSubComponents[];
  evaluationTitle: string;
  evaluationId: string;
}) {
  return (
    <div className={styles.lkeSidebar}>
      <div className={styles.sidebarHeader}>
        <div className={styles.title}>
          <Link href={`/sheets/${evaluationId}`}>
            <h4 className="font-bold text-lg text-center">{evaluationTitle}</h4>
          </Link>
        </div>

        <a href={`/sheets/${evaluationId}/instruction`}>
          <button type="button">Penjelasan Penilaian</button>
        </a>
      </div>

      <div className={styles.lkeComponentsContainer}>
        <h5 className="font-bold opacity-50">Daftar Komponen Tersedia</h5>

        <div className={styles.lkeComponentsSection}>
          {components.sort((a, b) => a.component_number - b.component_number).map((component) => (
            <ComponentCard
              key={component.id}
              component={component}
              subComponents={component.subComponents}
              evaluationId={evaluationId}
            />
          ))}
        </div>
      </div>

      <Link href={`/sheets/${evaluationId}/summary`}>
        <button type="button">Hasil Akhir LKE</button>
      </Link>
    </div>
  );
}
