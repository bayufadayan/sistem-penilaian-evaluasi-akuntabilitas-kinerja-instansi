"use client"
import { TiHome } from "react-icons/ti";
import { IoIosArrowForward } from "react-icons/io";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Suspense } from "react"
import { Helmet } from "react-helmet";
import { useDataContext } from "../../layout";
import React from 'react';
import useSWR, { mutate } from 'swr';
import { fetcher } from '@/lib/fetcher';
import TableSkeleton from '@/components/skeletons/TableSkeleton';

interface User {
  id: number;
  name: string;
}

interface Team {
  id: number;
  name: string;
  users: User[];
}

const AddTeam = dynamic(() => import("./addTeam"), { ssr: false });
const UpdateTeam = dynamic(() => import("./updateTeam"), { ssr: false });
const DeleteTeam = dynamic(() => import("./deleteTeam"), { ssr: false });
const ModalMemberTeam = dynamic(() => import("./modalMemberTeam"), { ssr: false });
const AddMemberTeam = dynamic(() => import("./addMemberTeam"), { ssr: false });

export default function ManagementTeamPage() {
  const dataContext = useDataContext();
  
  // SWR untuk caching teams data
  const { data: teams = [], isLoading } = useSWR<Team[]>('/api/teams', fetcher);

  const onAddSuccess = async () => {
    mutate('/api/teams');
  }

  const onEditSuccess = async () => {
    mutate('/api/teams');
  }

  return (
    <>
      {/* content nya */}
      <Helmet>
        <title>Manajemen Tim | {dataContext?.appNameContext}</title>
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
          <IoIosArrowForward className="h-5 w-5" />Manajemen Tim
        </div>

        {/* Manajemen User Bang */}
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-2xl font-semibold mb-4">Manajemen Tim</h1>

          <Suspense fallback={<div>Loading Add Team...</div>}>
            <AddTeam teams={teams} />
          </Suspense>
        </div>

        {/* Tabel Konten */}
        <div className="bg-white shadow-md rounded-lg p-6">
          {isLoading ? (
            <TableSkeleton rows={5} columns={4} />
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="py-2 pe-8">#</th>
                  <th className="py-2 w-52">NAMA TIM</th>
                  <th className="py-2">Anggota</th>
                  <th className="py-2">AKSI</th>
                </tr>
              </thead>
              {teams.length > 0 ? (
              <tbody>
                {teams.map((team, index) => (
                  <tr className="border-b" key={team.id}>
                    <td className="py-4">{index + 1}</td>
                    <td className="pe-8">{team.name.toUpperCase()}</td>
                    <td className="text-white">
                      <span className="flex items-stretch justify-start space-x-0 gap-2">
                        <AddMemberTeam
                          team={team}
                          onAddSuccess={async () => {
                            await onAddSuccess();
                          }}
                        />
                        <ModalMemberTeam team={team} />
                      </span>
                    </td>
                    <td>
                      <span className="flex items-stretch justify-start space-x-0">
                        <Suspense fallback={<div>Loading Update Team...</div>}>
                          <UpdateTeam team={team} onEditSuccess={async () => {
                            await onEditSuccess();
                          }} />
                        </Suspense>
                        {
                          team.name !== 'General' && (
                            <Suspense fallback={<div>Loading Delete Team...</div>}>
                              <DeleteTeam team={team} onDeleteSuccess={async () => {
                                await onEditSuccess();
                              }} />
                            </Suspense>
                          )
                        }
                      </span>
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
          )}
        </div>
      </div>
    </>
  );
}
