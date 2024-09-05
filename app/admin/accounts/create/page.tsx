"use client";
import type { User } from "@prisma/client";
import { type SyntheticEvent, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { redirect } from 'next/navigation'

import AdminNavbar from "../../components/adminNavbar";
import AdminSidebar from "../../components/adminSidebar";

export default function CreateAccountPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [nip, setNip] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [gender, setGender] = useState("");
  const [status, setStatus] = useState("");
  const [idTeam, setIdTeam] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await axios.post("/../../api/users", {
      name: name,
      nip: Number(nip),
      email: email,
      password: password,
      role: role,
      gender: gender,
      status: status,
      id_team: Number(idTeam),
    });
    setIsLoading(false);
    setName("");
    setNip("");
    setEmail("");
    setPassword("");
    setGender("");
    setStatus("");
    setIdTeam("");
    router.replace(`/admin/accounts?timestamp=${new Date().getTime()}`);

  };

  return (
    <>
      <AdminSidebar />
      <AdminNavbar />

      <div className="p-8 ml-64 mt-14">
        <h2 className="text-2xl font-bold text-white mb-6">
          Create New Account
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 mb-4 grid-cols-2">
            <div className="col-span-2">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-300"
              >
                Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                id="name"
                className="bg-gray-700 border border-gray-600 text-gray-200 rounded-lg p-2.5 w-full"
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="col-span-2">
              <label
                htmlFor="nip"
                className="block mb-2 text-sm font-medium text-gray-300"
              >
                NIP
              </label>
              <input
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                type="text"
                id="nip"
                className="bg-gray-700 border border-gray-600 text-gray-200 rounded-lg p-2.5 w-full"
                placeholder="Enter NIP"
                required
              />
            </div>

            <div className="col-span-2">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-300"
              >
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="email"
                className="bg-gray-700 border border-gray-600 text-gray-200 rounded-lg p-2.5 w-full"
                placeholder="Enter email"
                required
              />
            </div>

            <div className="col-span-2">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                id="password"
                className="bg-gray-700 border border-gray-600 text-gray-200 rounded-lg p-2.5 w-full"
                placeholder="Enter password"
                required
              />
            </div>

            <div className="col-span-1">
              <label
                htmlFor="role"
                className="block mb-2 text-sm font-medium text-gray-300"
              >
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                id="role"
                className="bg-gray-700 border border-gray-600 text-gray-200 rounded-lg p-2.5 w-full"
              >
                <option value="" selected>Select Role</option>
                <option value="ADMIN">Admin</option>
                <option value="USER">User</option>
              </select>
            </div>

            <div className="col-span-1">
              <label
                htmlFor="gender"
                className="block mb-2 text-sm font-medium text-gray-300"
              >
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                id="gender"
                className="bg-gray-700 border border-gray-600 text-gray-200 rounded-lg p-2.5 w-full"
              >
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>

            <div className="col-span-1">
              <label
                htmlFor="status"
                className="block mb-2 text-sm font-medium text-gray-300"
              >
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                id="status"
                className="bg-gray-700 border border-gray-600 text-gray-200 rounded-lg p-2.5 w-full"
              >
                <option value="">Select status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            <div className="col-span-1">
              <label
                htmlFor="idTeam"
                className="block mb-2 text-sm font-medium text-gray-300"
              >
                Team
              </label>
              <select
                value={idTeam}
                onChange={(e) => setIdTeam(e.target.value)}
                id="idTeam"
                className="bg-gray-700 border border-gray-600 text-gray-200 rounded-lg p-2.5 w-full"
              >
                <option value="">Select team</option>
                <option value="1">Team 1</option>
                <option value="2">Team 2</option>
                <option value="3">Team 3</option>
              </select>
            </div>
          </div>
          {!isLoading ? (
            <button
              type="submit"
              className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <svg
                className="me-1 -ms-1 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title hidden>sat</title>
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add new account
            </button>
          ) : (
            <button
              type="button"
              className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              <svg
                aria-hidden="true"
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
