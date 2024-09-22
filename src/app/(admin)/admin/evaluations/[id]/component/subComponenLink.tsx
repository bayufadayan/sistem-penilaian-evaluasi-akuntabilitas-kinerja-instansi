"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";

export default function SubComponentLink({
    componentId,
    length
}: {
    componentId: number;
    length: number;
}) {
    const pathname = usePathname();
    const subComponentUrl = `${pathname}/${componentId}/subcomponent`;
    return (
        <Link
            href={subComponentUrl}
            className="flex gap-2 p-2 rounded-lg border border-blue-500 w-fit hover:bg-blue-100 cursor-pointer"
        >
            <FiExternalLink className="w-5 h-5 text-blue-600" />
            <div className="text-blue-600 text-sm">Sub Komponen ({length})</div>
        </Link>
    );
}
