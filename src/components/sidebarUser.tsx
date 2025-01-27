import Link from "next/link";
import ComponentCard from "./component";
import styles from "@/styles/styles.module.css";
import type { Component } from "@prisma/client";
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md";
import { useState } from "react";

type ComponentWithSubComponents = Component & {
  subComponents: SubComponent[];
  team: Team;
};

interface SubComponent {
  id: number;
  name: string;
  description: string;
  weight: number;
  subcomponent_number: number;
}

interface Team {
  id: number;
  name: string;
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <button className={`border border-gray-300 md:hidden py-2 px-3 fixed block bg-white rounded-lg shadow-md mt-20 z-50 ${isSidebarOpen ? "right-4" : "left-4"}`} onClick={toggleSidebar}>
        {isSidebarOpen
          ? (<MdKeyboardDoubleArrowLeft className="w-6 h-6" />)
          : (<MdKeyboardDoubleArrowRight className="w-6 h-6" />)}
      </button>
      <div className={`${styles.lkeSidebar} ${isSidebarOpen ? "flex" : "hidden"} md:flex`}>
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
                evaluationId={evaluationId} />
            ))}
          </div>
        </div>

        <Link href={`/sheets/${evaluationId}/summary`} className="mb-3">
          <button type="button">Hasil Akhir LKE</button>
        </Link>
      </div>
    </div>
  );
}
