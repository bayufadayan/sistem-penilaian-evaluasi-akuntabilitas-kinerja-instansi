"use client";

import { FiExternalLink } from "react-icons/fi";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CriteriaLink({
    subcomponentId,
    length,
}: {
    subcomponentId: number;
    length: number
}) {
    const pathname = usePathname();
    const criteriaUrl = `${pathname}/${subcomponentId}/criteria`;

    return (
        <Link
            href={criteriaUrl}
            className="flex gap-2 p-2 rounded-lg border border-blue-500 w-fit hover:bg-blue-100 cursor-pointer"
        >
            <FiExternalLink className="w-5 h-5 text-blue-600" />
            <div className="text-blue-600 text-sm">Kriteria ({length})</div>
        </Link>
    );
}
