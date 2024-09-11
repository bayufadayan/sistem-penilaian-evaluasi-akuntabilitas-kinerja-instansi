import Link from "next/link";
import ComponentCard from "./component";
import styles from "@/styles/styles.module.css";
// import React, { useEffect, useState } from "react";

interface Component {
  id: number;
  name: string;
  description: string;
  weight: number;
  subComponents: SubComponent[];
}

interface SubComponent {
  id: number;
  name: string;
  description: string;
  weight: number;
}

export default function SidebarUser({
  components,
  evaluationTitle,
  evaluationId,
}: {
  components: Component[];
  evaluationTitle: string;
  evaluationId: string;
}) {
  return (
    <div className={styles.lkeSidebar}>
      <div className={styles.sidebarHeader}>
        <div className={styles.title}>
          <h4 className="font-bold text-lg text-center">{evaluationTitle}</h4>
        </div>

        <a href={`/sheets/${evaluationId}/instruction`}>
          <button type="button">Penjelasan Penilaian</button>
        </a>
      </div>

      <div className={styles.lkeComponentsContainer}>
        <h5 className="font-bold opacity-50">Daftar Komponen Tersedia</h5>

        <div className={styles.lkeComponentsSection}>
          {components.map((component) => (
            <ComponentCard
              key={component.id}
              component={component}
              subComponents={component.subComponents}
              evaluationId = {evaluationId}
            />
          ))}
        </div>
      </div>

      <Link href="#">
        <button type="button">Selesai</button>
      </Link>
    </div>
  );
}
