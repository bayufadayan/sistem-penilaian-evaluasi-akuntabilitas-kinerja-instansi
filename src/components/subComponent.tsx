import "@/styles/styles.module.css"

interface SubComponent {
  id: number;
  name: string;
  description: string;
  weight: number;
}


export default function SubComponentListCard({subComponents} : {subComponents: SubComponent[]}) {
  return (
    subComponents.map((subComponent) => (
      <p key={subComponent.id} className="font-medium hover:bg-slate-600 hover:text-white hover:cursor-pointer">{subComponent.name}</p>
    ))
  );
}
