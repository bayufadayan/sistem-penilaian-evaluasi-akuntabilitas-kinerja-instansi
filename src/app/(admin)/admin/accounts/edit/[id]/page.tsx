"use client";
import { type SyntheticEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import type { Team } from "@prisma/client";


const fetchTeams = async () => {
  const res = await axios.get("/api/teams");
  return res.data;
};

export default function UpdateAccountPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  const [loadingData, setLoadingData] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [nip, setNip] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [gender, setGender] = useState("");
  const [status, setStatus] = useState("");
  const [idTeam, setIdTeam] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);

  const router = useRouter();

  const handleUpdate = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.patch(`/api/users/${id}`, {
        name: name,
        nip: Number(nip),
        email: email,
        role: role,
        gender: gender,
        status: status,
        id_team: Number(idTeam),
      });

      console.log("Response:", response.data);
      setName("");
      setNip("");
      setEmail("");
      setGender("");
      setStatus("");
      setIdTeam("");
      setIsLoading(false);

      router.replace(`/admin/accounts?timestamp=${new Date().getTime()}`);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const teamsData = await fetchTeams();
        setTeams(teamsData);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };
    loadTeams();
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get(`/api/users/${id}`);
      console.log("Response from API:", response.data);

      const user = response.data;

      if (!user) {
        router.push("/404");
        return;
      }
      setName(user.name || "");
      setNip(user.nip || "");
      setEmail(user.email || "");
      setRole(user.role || "");
      setGender(user.gender || "");
      setStatus(user.status || "");
      setIdTeam(user.id_team || "");

      setLoadingData(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      {loadingData && (
        <div className="fixed inset-0 bg-opacity-75 flex items-center justify-center z-50 bg-black">
          <div className="text-center">
            <svg
              aria-hidden="true"
              // biome-ignore lint/a11y/useSemanticElements: <explanation>
              role="status"
              className="inline w-4 h-4 me-3 text-white animate-spin"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>
            <p className="mt-4 text-white text-lg">Sedang mengambil data...</p>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-semibold mb-4">Update Akun</h2>
        <form onSubmit={handleUpdate}>
          <div className="grid gap-4 mb-4 grid-cols-2">
            <div className="col-span-2">
              <label
                htmlFor="name"
                className="label font-bold"
              >
                Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                id="name"
                className="input input-bordered w-full"
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="col-span-2">
              <label
                htmlFor="nip"
                className="label font-bold"
              >
                NIP
              </label>
              <input
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                type="number"
                id="nip"
                className="input input-bordered w-full"
                placeholder="Enter NIP"
                required
              />
            </div>

            <div className="col-span-2">
              <label
                htmlFor="email"
                className="label font-bold"
              >
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="email"
                className="input input-bordered w-full"
                placeholder="Enter email"
                required
              />
            </div>

            <div className="col-span-2">
              <label
                htmlFor="password"
                className="label font-bold"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="input input-bordered w-full disabled"
                placeholder="Tidak Dapat merubah password secara instan"
                disabled
              />
            </div>

            <div className="col-span-1">
              <label
                htmlFor="role"
                className="label font-bold"
              >
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                id="role"
                className="input input-bordered w-full"
              >
                <option value="">Select Role</option>
                <option value="ADMIN">Admin</option>
                <option value="USER">User</option>
              </select>
            </div>

            <div className="col-span-1">
              <label
                htmlFor="gender"
                className="label font-bold"
              >
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                id="gender"
                className="input input-bordered w-full"
              >
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>

            <div className="col-span-1">
              <label
                htmlFor="status"
                className="label font-bold"
              >
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                id="status"
                className="input input-bordered w-full"
              >
                <option value="">Select status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            <div className="col-span-1">
              <label
                htmlFor="idTeam"
                className="label font-bold"
              >
                Team
              </label>
              <select
                value={idTeam}
                onChange={(e) => setIdTeam(e.target.value)}
                id="idTeam"
                className="input input-bordered w-full"
              >
                <option value="">Select team</option>
                {teams.map((team) => (
                  <option value={team.id} key={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {!isLoading ? (
            <button
              type="submit"
              className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Save
            </button>
          ) : (
            <button
              type="button"
              className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              <svg
                aria-hidden="true"
                // biome-ignore lint/a11y/useSemanticElements: <explanation>
                role="status"
                className="inline w-4 h-4 me-3 text-white animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
              Saving...
            </button>
          )}
        </form>
      </div>
    </>
  );
}