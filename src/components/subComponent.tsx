import "@/styles/styles.module.css";
import Link from "next/link";

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
  evaluationId : string
}) {
  return subComponents.sort(
    (a: SubComponent, b: SubComponent) =>
      a.subcomponent_number - b.subcomponent_number
  ).map((subComponent) => (
    <Link href={`/sheets/${evaluationId}/${subComponent.id}`} key={subComponent.id}>
      <p
        className="font-medium hover:bg-slate-600 hover:text-white hover:cursor-pointer"
      >
        {subComponent.name}
      </p>
    </Link>
  ));
}
