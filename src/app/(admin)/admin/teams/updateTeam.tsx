"use client";
import { useState } from "react";
import type { Team } from "@prisma/client";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { teamFormSchema } from "@/lib/form-schema";

type TeamFormData = {
  name: string;
};

export default function UpdateTeam({ team }: { team: Team }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TeamFormData>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      name: team.name,
    },
  });

  const handleUpdate = async (data: TeamFormData) => {
    setIsLoading(true);
    try {
      await axios.patch(`/api/teams/${team.id}`, {
        name: data.name,
      });
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
        className="mb-2 group-hover:opacity-100 focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:focus:ring-yellow-900 h-full"
      >
        <span className="flex gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-5"
          >
            <title hidden>te</title>
            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
          </svg>
        </span>
      </button>

      <div className={isOpen ? "modal modal-open" : "modal"}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Update {team.name}</h3>
          <form onSubmit={handleSubmit(handleUpdate)}>
            <div className="form-control w-full">
              <label className="label font-bold">Nama Tim</label>
              <input
                type="text"
                {...register("name")} // Register input for form validation
                className={`input input-bordered ${errors.name ? "input-error" : ""}`}
                placeholder="Nama Tim"
              />
              {errors.name?.message && (
                <span className="text-red-500">{errors.name.message}</span>
              )}
            </div>
            <div className="modal-action">
              <button type="button" className="btn" onClick={handleModal}>
                Close
              </button>
              {!isLoading ? (
                <button type="submit" className="btn btn-primary">
                  Update
                </button>
              ) : (
                <button type="button" className="btn loading">
                  Updating...
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
