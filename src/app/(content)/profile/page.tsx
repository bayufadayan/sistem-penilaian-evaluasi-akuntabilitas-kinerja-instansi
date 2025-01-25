"use client";
import React, { useCallback, useEffect, useState } from "react";
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
  const [isLoading, setIsLoading] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSave = (updatedDetails: any) => {
    setUserDetails(updatedDetails);
    setEditModalOpen(false);

    axios
      .put(`/api/users/${session?.user?.id}`, updatedDetails)
      .then(() => console.log("User updated successfully"))
      .catch((err) => console.error("Error updating user:", err));

    fetchUserDetails();
  };

  const fetchUserDetails = useCallback(async () => {
    try {
      setIsLoading(true)
      if (!session || !session.user?.id) {
        return;
      }

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

      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.error("Failed to fetch user or team details:", error);
    }
  }, [session]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserDetails();
    }
  }, [fetchUserDetails, session]);

  useEffect(() => {
    document.title = "Profil Saya";
  });

  return (
    <main className="bg-gradient-to-r bg-[#ecf1f4] min-h-screen flex items-center justify-center pt-16">
      <div className="bg-white w-full max-w-4xl p-8 rounded-lg shadow-lg">

        <div className="flex justify-between">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Profil Saya</h1>
          {isLoading && (
            <div className="px-4 bg-blue-600 text-white rounded-lg shadow-lg flex text-center items-center">
              <svg
                aria-hidden="true"
                className="w-6 h-6 text-gray-200 animate-spin dark:text-white-600 fill-blue-400 mr-2"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg> Loading ...
            </div>
          )}
        </div>

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
