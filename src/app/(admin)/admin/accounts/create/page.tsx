"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import type { Team } from "@prisma/client";
import type { FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userFormSchema } from "@/lib/form-schema";
import type { z } from "zod";

const fetchTeams = async () => {
  const res = await axios.get("/api/teams");
  return res.data;
};

const CreateAccountPage: FC = () => {
  return (
    <>
      <UserForm />
    </>
  );
};

const UserForm: FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isEmailNotAvailable, setIsEmailNotAvailable] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
  });

  const onSubmit = async (values: z.infer<typeof userFormSchema>) => {
    setIsLoading(true);
    setIsEmailNotAvailable(false);

    try {
      await axios.post("/api/users", {
        name: values.name,
        nip: Number(values.nip),
        email: values.email,
        password: values.password,
        role: values.role,
        gender: values.gender,
        status: values.status,
        id_team: Number(values.id_team),
      });

      reset();
      router.push(`/admin/accounts?timestamp=${new Date().getTime()}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          // alert(error.response.data.message);
          setIsEmailNotAvailable(true);
          setToastMessage(error.response.data.message);
        }
      }
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
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
  }, []);

  useEffect(() => {
    if (isEmailNotAvailable) {
      const timer = setTimeout(() => {
        setIsEmailNotAvailable(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isEmailNotAvailable]);

  return (
    <div>
      {isEmailNotAvailable && (
        <div
          id="toast-danger"
          className={`fixed right-4 flex items-center w-full max-w-xs p-4 mb-4 text-gray-700 bg-white rounded-lg shadow-lg border border-red-300 transition-all duration-500 ease-in-out transform ${
            isEmailNotAvailable ? "animate-slideIn" : "animate-slideOut"
          }`}
          role="alert"
        >
          <div className="inline-flex items-center justify-center flex-shrink-0 w-10 h-10 text-red-500 bg-red-100 rounded-full shadow-md">
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
            </svg>
            <span className="sr-only">Error icon</span>
          </div>
          <div className="ml-3 text-sm font-medium text-red-700">
            {toastMessage}
          </div>
          <button
            type="button"
            className="ml-auto text-gray-400 hover:text-gray-900 focus:ring-2 focus:ring-red-300 p-1.5 rounded-lg bg-transparent hover:bg-gray-200 focus:bg-gray-100"
            aria-label="Close"
            onClick={() => setIsEmailNotAvailable(false)}
          >
            <span className="sr-only">Close</span>
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4">Create New Account</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 mb-4 grid-cols-2">
          {/* Name Field */}
          <div className="col-span-2">
            <label htmlFor="name" className="label font-bold">
              Name
            </label>
            <input
              {...register("name")}
              type="text"
              id="name"
              className="input input-bordered w-full"
              placeholder="Enter full name"
              required
            />
            {errors.name && <p className="text-error">{errors.name.message}</p>}
          </div>

          {/* NIP Field */}
          <div className="col-span-2">
            <label htmlFor="nip" className="label font-bold">
              NIP
            </label>
            <input
              {...register("nip")}
              type="number"
              id="nip"
              className="input input-bordered w-full"
              placeholder="Enter NIP"
              required
            />
            {errors.nip && <p className="text-error">{errors.nip.message}</p>}
          </div>

          {/* Email Field */}
          <div className="col-span-2">
            <label htmlFor="email" className="label font-bold">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              className="input input-bordered w-full"
              placeholder="Enter email"
              required
            />
            {errors.email && (
              <p className="text-error">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="col-span-2">
            <label htmlFor="password" className="label font-bold">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              id="password"
              className="input input-bordered w-full"
              placeholder="Enter password"
              required
            />
            {errors.password && (
              <p className="text-error">{errors.password.message}</p>
            )}
          </div>

          {/* Role Field */}
          <div className="col-span-1">
            <label htmlFor="role" className="label font-bold">
              Role
            </label>
            <select
              {...register("role")}
              id="role"
              className="select select-bordered w-full"
            >
              <option value="">Select Role</option>
              <option value="ADMIN">Admin</option>
              <option value="USER">User</option>
            </select>
            {errors.role && <p className="text-error">{errors.role.message}</p>}
          </div>

          {/* Gender Field */}
          <div className="col-span-1">
            <label htmlFor="gender" className="label font-bold">
              Gender
            </label>
            <select
              {...register("gender")}
              id="gender"
              className="select select-bordered w-full"
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
            {errors.gender && (
              <p className="text-error">{errors.gender.message}</p>
            )}
          </div>

          {/* Status Field */}
          <div className="col-span-1">
            <label htmlFor="status" className="label font-bold">
              Status
            </label>
            <select
              {...register("status")}
              id="status"
              className="select select-bordered w-full"
            >
              <option value="">Select Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
            {errors.status && (
              <p className="text-error">{errors.status.message}</p>
            )}
          </div>

          {/* Team Field */}
          <div className="col-span-1">
            <label htmlFor="idTeam" className="label font-bold">
              Team
            </label>
            <select
              {...register("id_team")}
              id="idTeam"
              className="select select-bordered w-full"
            >
              <option value="">Select Team</option>
              {teams.map((team) => (
                <option value={team.id} key={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
            {errors.id_team && (
              <p className="text-error">{errors.id_team.message}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        {!isLoading ? (
          <button
            type="submit"
            className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Add new account
          </button>
        ) : (
          <button
            type="button"
            className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
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
  );
};

export default CreateAccountPage;
