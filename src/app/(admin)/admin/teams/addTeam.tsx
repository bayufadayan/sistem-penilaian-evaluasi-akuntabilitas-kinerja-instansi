"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { teamFormSchema } from "@/lib/form-schema";
import type { Team } from "@prisma/client";

type TeamFormData = {
  name: string;
};


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function AddTeam({ teams }: { teams: Team[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TeamFormData>({
    resolver: zodResolver(teamFormSchema),
  });

  // Handle form submission
  const onSubmit = async (data: { name: string }) => {
    setIsLoading(true);
    try {
      await axios.post("/api/teams", data);
      setIsLoading(false);
      reset();
      router.refresh();
      setIsOpen(false);
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  };

  const handleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleModal}
        className="flex flex-row items-center gap-1 text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6"
        >
          <title hidden>Tambah Tim</title>
          <path
            fillRule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
            clipRule="evenodd"
          />
        </svg>{" "}
        <strong className="font-semibold">Tambah Tim</strong>
      </button>

      <div className={isOpen ? "modal modal-open" : "modal"}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Tambah Tim Baru</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control w-full">
              <label className="label font-bold">Nama Tim</label>
              <input
                type="text"
                {...register("name")} // Register input for form validation
                className={`input input-bordered ${
                  errors.name ? "input-error" : ""
                }`}
                placeholder="Nama Tim"
              />
              {errors.name?.message && (
                <span className="text-red-500">
                  {String(errors.name.message)}
                </span>
              )}
            </div>
            <div className="modal-action">
              <button type="button" className="btn" onClick={handleModal}>
                Close
              </button>
              {!isLoading ? (
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              ) : (
                <button type="button" className="btn loading">
                  Saving...
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
