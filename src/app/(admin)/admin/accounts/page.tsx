"use client"
import { TiHome } from "react-icons/ti";
import { IoIosArrowForward } from "react-icons/io";
import Link from "next/link";
import React, { useEffect, useState } from 'react';
import { Suspense, lazy } from "react";
import { Helmet } from "react-helmet";
import { useDataContext } from "../../layout";

interface Team {
  name: string;
}

interface User {
  id: number;
  email: string;
  password: string;
  nip: bigint;
  name: string;
  role: string;
  gender: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  id_team: number;
  resetPasswordExpire?: Date | null;
  resetPasswordToken?: string | null;
  team: Team;
}

// Lazy loaded components
const DeleteAccount = lazy(() => import("./deleteAccount"));
const AdminAddButton = lazy(() => import("../../components/adminAddButton"));
const AdminEditButton = lazy(() => import("../../components/buttons/adminEditButton"));

export default function ManagementAccountPage() {
  const [users, setUsers] = useState<User[]>([]);
  const dataContext = useDataContext();

  useEffect(() => {

    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const usersData = await response.json();
        setUsers(usersData);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);


  return (
    <>
      <Helmet>
        <title>Manajemen Akun | {dataContext?.appNameContext}</title>
        <meta name="description" content="Mengelola Data Akun user" />
      </Helmet>
      <div>
        {/* Breadcrumb */}
        <div className="mb-4 text-gray-500 flex gap-1 items-start">
          <Link href="/admin" className="text-blue-600">
            <span className="flex gap-1">
              <TiHome className="mt-0.5" /> Dashboard
            </span>
          </Link>
          <IoIosArrowForward className="h-5 w-5" />
          Manajemen Akun
        </div>

        {/* Manajemen User */}
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-2xl font-semibold mb-4">Manajemen Akun Pengguna</h1>

          <Suspense fallback={<div>Loading Add Button...</div>}>
            <AdminAddButton props="/admin/accounts/create/" label="Tambah Akun" />
          </Suspense>
        </div>

        {/* Tabel Konten */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="py-2 pe-8">#</th>
                <th className="py-2 w-52">NAMA LENGKAP</th>
                <th className="py-2 pe-8">NIP</th>
                <th className="py-2 pe-8">STATUS</th>
                <th className="py-2 pe-8">DIVISI</th>
                <th className="py-2">AKSI</th>
              </tr>
            </thead>
            {users.length > 0 ? (
              <tbody>
                {users.map((user, index) => (
                  <tr className="border-b" key={user.id}>
                    <td className="py-4">{index + 1}</td>
                    <td className="pe-8">{user.name.toUpperCase()}</td>
                    <td className="text-blue-500">{user.nip.toString()}</td>
                    <td
                      className={user.status === "ACTIVE"
                        ? "text-green-500"
                        : "text-red-500"}
                    >
                      {user.status}
                    </td>
                    <td>{user.team?.name || "Tidak ada tim"}</td>
                    <td>
                      <Suspense fallback={<div>Loading Edit Button...</div>}>
                        <AdminEditButton
                          props={`/admin/accounts/edit/${user.id}`} />
                      </Suspense>
                      <Suspense fallback={<div>Loading Delete Button...</div>}>
                        <DeleteAccount user={user} />
                      </Suspense>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    <p className="text-gray-500">Data tidak ditemukan</p>
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>
    </>
  );
}
