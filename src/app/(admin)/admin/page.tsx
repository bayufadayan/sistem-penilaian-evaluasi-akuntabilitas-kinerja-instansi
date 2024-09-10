'use client'
import { useSession } from "next-auth/react";

export default async function AdminPage() {

  return (
    <div>
        <h1 className="font-bold text-3xl mt-2">Dashboard Admin</h1>
    </div>
  );
}
