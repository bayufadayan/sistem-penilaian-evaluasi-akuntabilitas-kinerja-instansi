"use client";
import React, { useEffect, useState } from "react";
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSave = (updatedDetails: any) => {
    setUserDetails(updatedDetails);
    setEditModalOpen(false);

    axios
      .put(`/api/users/${session?.user?.id}`, updatedDetails)
      .then(() => console.log("User updated successfully"))
      .catch((err) => console.error("Error updating user:", err));
  };

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
    document.title = "Profil Saya";
  });

  return (
    <main className="bg-gradient-to-r bg-[#ecf1f4] min-h-screen flex items-center justify-center pt-16">
      <div className="bg-white w-full max-w-4xl p-8 rounded-lg shadow-lg">

        <h1 className="text-3xl font-bold mb-6 text-gray-800">Profil Saya</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Kartu Profil */}
          <div className={`${userDetails.gender === "FEMALE" ? "bg-gradient-to-br from-pink-500 to-pink-700" : "bg-gradient-to-br from-blue-500 to-blue-700"} flex flex-col items-center text-white p-6 rounded-lg shadow-lg`}>
            <div className="relative">
              <div className="w-28 h-28 bg-blue-300 rounded-full flex items-center justify-center text-7xl font-bold">
                {userDetails.gender === "MALE" ? "👨" : "👩"}
              </div>
            </div>
            <h2
              className="mt-4 text-2xl font-bold break-words max-w-[15ch] text-center"
              style={{ wordWrap: "break-word", whiteSpace: "normal" }}
            >
              {userDetails.name}
            </h2>

            <p className="text-sm text-gray-100 mb-2">NIP: {userDetails.nip}</p>
            <span className={`${userDetails.gender === "FEMALE" ? "bg-pink-800" : "bg-blue-800"} px-4 py-1 text-sm rounded-full`}>
              {userDetails.gender === "MALE" ? "Laki-laki" : "Perempuan"}
            </span>

            <div className="mt-6 text-center">
              <p className="text-sm font-medium text-gray-300">
                Diperbarui Terakhir
              </p>
              <p className="text-lg font-semibold">
                {new Date(userDetails.updatedAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <span className="text-sm">
                {new Date(userDetails.updatedAt).toLocaleTimeString("id-ID")}
              </span>
            </div>
          </div>

          {/* Informasi Akun */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Informasi Akun</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Nama</p>
                <p className="text-lg font-semibold text-gray-800 break-words">
                  {userDetails.name}
                </p>
              </div>


              <div>
                <p className="text-sm font-medium text-gray-500">Role</p>
                <p className="text-lg font-semibold text-gray-800">
                  {userDetails.role}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">NIP</p>
                <p className="text-lg font-semibold text-gray-800 break-words">
                  {userDetails.nip}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Tim</p>
                <p className="text-lg font-semibold text-gray-800 break-words">
                  {userDetails.team ? userDetails.team : "Belum masuk tim manapun"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-lg font-semibold text-gray-800 break-words">
                  {userDetails.email}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <span
                  className={`px-3 py-1 rounded-full text-white text-sm ${userDetails.status === "ACTIVE"
                    ? "bg-green-600"
                    : "bg-red-600"
                    }`}
                >
                  {userDetails.status}
                </span>
              </div>
            </div>
            {/* Tombol Edit */}
            <div className="mt-6 flex justify-start">
              <button
                onClick={() => setEditModalOpen(true)}
                className={`${userDetails.gender === "FEMALE" ? " bg-pink-600 hover:bg-pink-700 focus:ring-pink-500" : "hover:bg-blue-700 focus:ring-blue-500 bg-blue-600"} px-6 py-2 text-white rounded-md shadow-md`}
              >
                Edit Profil
              </button>
            </div>
          </div>
        </div>
      </div>
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        userDetails={userDetails}
        onSave={handleSave}
      />
    </main>
  );
}

export default MyProfilePage;
