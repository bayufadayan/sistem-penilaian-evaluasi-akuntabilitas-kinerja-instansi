"use client"
import "@/styles/styles.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SubComponent {
  id: number;
  name: string;
  description: string;
  weight: number;
  subcomponent_number: number;
}

export default function SubComponentListCard({
  subComponents,
  evaluationId
}: {
  subComponents: SubComponent[];
  evaluationId: string
}) {

  const pathname = usePathname();
  const pathSegments = pathname.split('/');
  const subcomponentId = pathSegments[pathSegments.length - 1];

  return subComponents.sort(
    (a: SubComponent, b: SubComponent) =>
      a.subcomponent_number - b.subcomponent_number
  ).map((subComponent) => (
    <Link href={`/sheets/${evaluationId}/${subComponent.id}`} key={subComponent.id}>
      <p
        className={`font-medium hover:text-white hover:cursor-pointer ${subcomponentId === String(subComponent.id)
            ? "bg-green-600 text-white"
            : "bg-blue-100 hover:bg-slate-600"
          }`}
      >
        {subComponent.name}
      </p>
    </Link>
  ));
}
