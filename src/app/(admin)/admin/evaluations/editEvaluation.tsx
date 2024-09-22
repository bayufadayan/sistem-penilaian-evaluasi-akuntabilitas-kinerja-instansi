import React from "react";
import { AiOutlineEdit } from "react-icons/ai";
import Link from "next/link";

export default function EditEvaluation({ editUrl }: { editUrl: string }) {
  return (
    <Link href={editUrl}>
      <button
        type="button"
        className="h-full flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg shadow-md hover:bg-blue-100 transition-all duration-200"
      >
        <AiOutlineEdit className="w-5 h-5" />
        <span className="font-semibold">Edit</span>
      </button>
    </Link>
  );
}
