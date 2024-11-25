/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { TiHome } from "react-icons/ti";
import { IoIosArrowForward } from "react-icons/io";
import Link from "next/link";
import axios from "axios";
import { useSession } from "next-auth/react";
import EditProfileModal from "./editProfileModal";

function MyProfilePage() {
  const { data: session } = useSession();
  const [userDetails, setUserDetails] = useState({
    id: "",
    email: "",
    password: "********",
    nip: "",
    name: "",
    role: "",
    gender: "",
    status: "",
    team: "",
    updatedAt: "",
  });
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const handleSave = (updatedDetails: any) => {
    setUserDetails(updatedDetails);
    setEditModalOpen(false);

    axios
      .put(`/api/users/${session?.user?.id}`, updatedDetails)
      .then(() => console.log("User updated successfully"))
      .catch((err) => console.error("Error updating user:", err));
  };

  // Fetch user and team details
  useEffect(() => {
    if (session?.user?.id) {
      const fetchUserDetails = async () => {
        try {
          const userResponse = await axios.get(`/api/users/${session.user.id}`);
          const userData = userResponse.data;

          const teamResponse = await axios.get(
            `/api/teams/${userData.id_team}`
          );
          const teamData = teamResponse.data;

          setUserDetails({
            id: userData.id,
            email: userData.email,
            password: "********",
            nip: userData.nip,
            name: userData.name,
            role: userData.role,
            gender: userData.gender,
            status: userData.status,
            team: teamData.name,
            updatedAt: userData.updated_at,
          });
        } catch (error) {
          console.error("Failed to fetch user or team details:", error);
        }
      };

      fetchUserDetails();
    }
  }, [session]);

  useEffect(() => {
    document.title = "Profile Saya";
  });



  return (
    <div>
      <div className="mb-4 text-gray-500 flex gap-1 items-start">
        <Link href="/admin" className="text-blue-600">
          <span className="flex gap-1">
            <TiHome className="mt-0.5" /> Dashboard
          </span>
        </Link>
        <IoIosArrowForward className="h-5 w-5" />
        Profil Saya
      </div>

      <div className="flex justify-between items-center mb-1">
        <h1 className="text-2xl font-semibold mb-4">Profil Saya</h1>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Bagian Kiri */}
        <div className="relative flex flex-col items-center w-full md:w-1/3 bg-gray-50 p-6 rounded-lg shadow">
          <div className="w-32 h-32 bg-blue-500 text-white rounded-full flex items-center justify-center text-6xl font-bold mb-6">
            <span>{userDetails.gender === "MALE" ? "👨" : "👩"}</span>
          </div>
          <p className="text-xl font-semibold text-gray-800">
            {userDetails.name}
          </p>
          <p className="text-sm text-gray-500 mb-2">NIP: {userDetails.nip}</p>
          <p className="text-sm text-gray-700 bg-blue-100 px-3 py-1 rounded-full">
            {userDetails.gender === "MALE" ? "Laki-laki" : "Perempuan"}
          </p>

          <div className="absolute bottom-2 flex flex-col items-center">
            <p className="text-sm font-medium text-gray-600">
              Diperbarui Terakhir
            </p>
            <p className="text-lg font-semibold text-blue-600">
              {new Date(userDetails.updatedAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <div className="flex gap-1"><span>pukul</span>
              {new Date(userDetails.updatedAt).toLocaleString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}</div>
          </div>
        </div>

        {/* Bagian Kanan */}
        <div className="w-full md:w-2/3 bg-gray-50 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Informasi Akun</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Informasi */}
            <div>
              <p className="text-sm font-medium text-gray-600">Nama</p>
              <p className="text-lg font-semibold text-gray-800 break-words">
                {userDetails.name}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Role</p>
              <p className="text-lg font-semibold text-gray-800">
                {userDetails.role}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">NIP</p>
              <p className="text-lg font-semibold text-gray-800">
                {userDetails.nip}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600">Tim</p>
              <p className="text-lg font-semibold text-gray-800 break-words">
                {userDetails.team}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Email</p>
              <p className="text-lg font-semibold text-gray-800 break-words">
                {userDetails.email}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600">Status</p>
              <p className="mt-2">
                <span
                  className={`${userDetails.status === "ACTIVE"
                    ? "bg-green-700"
                    : "bg-red-700"
                    } rounded p-2 text-white w-fit`}
                >
                  {userDetails.status}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Password</p>
              <p className="text-lg font-semibold text-gray-800">************</p>
            </div>
          </div>
          {/* Tombol Edit */}
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => setEditModalOpen(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Edit
            </button>
          </div>
        </div>

      </div>
      {/* Tombol Edit */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        userDetails={userDetails}
        onSave={handleSave}
      />
    </div>
  );
}

export default MyProfilePage;
