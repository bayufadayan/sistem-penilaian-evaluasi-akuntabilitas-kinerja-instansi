"use client";
import { useState, type SyntheticEvent } from "react";
import type { Component, Team } from "@prisma/client";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function UpdateComponent({
  component,
  teams,
}: {
  component: Component;
  teams: Team[];
}) {
  const [name, setName] = useState(component.name);
  const [description, setDescription] = useState(component.description);
  const [weight, setWeight] = useState(component.weight);
  const [componentNumber, setComponentNumber] = useState(
    component.component_number
  );
  const [idTeams, setIdTeam] = useState(component.id_team); // Untuk memilih tim
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleUpdate = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Gunakan id_LKE dari komponen yang sedang di-update
    await axios.patch(`/api/components/${component.id}`, {
      name: name,
      description: description,
      weight: weight,
      component_number: componentNumber,
      id_team: idTeams, // Tetap ambil id_team dari input
      id_LKE: component.id_LKE, // Gunakan id_LKE yang sudah ada di component
    });

    setIsLoading(false);
    router.refresh();
    setIsOpen(false);
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
          <h3 className="font-bold text-lg">Update Komponen</h3>
          <form onSubmit={handleUpdate}>
            <div className="form-control w-full">
              <label className="label font-bold" htmlFor="">
                Nomor Komponen
              </label>
              <input
                type="number"
                value={componentNumber}
                onChange={(e) =>
                  setComponentNumber(Number.parseFloat(e.target.value))
                }
                className="input input-bordered"
                placeholder="0.00"
                required
              />
            </div>
            <div className="form-control w-full">
              <label className="label font-bold" htmlFor="">
                Nama Komponen
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered"
                placeholder="Nama Komponen"
                required
              />
            </div>
            <div className="form-control w-full">
              <label className="label font-bold" htmlFor="deskripsi">
                Deskripsi
              </label>
              <textarea
                value={description ?? "Tidak ada deskripsi"}
                onChange={(e) => setDescription(e.target.value)}
                className="px-5 py-2 textarea textarea-bordered"
                placeholder="Deskripsi"
                name="deskripsi"
              />
            </div>
            <div className="form-control w-full">
              <label className="label font-bold" htmlFor="">
                Bobot
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number.parseFloat(e.target.value))}
                className="input input-bordered"
                placeholder="0.00"
                required
              />
            </div>

            <div className="form-control w-full">
              <label htmlFor="idTeam" className="label font-bold">
                Team
              </label>
              <select
                value={idTeams}
                onChange={(e) => setIdTeam(Number.parseInt(e.target.value))}
                id="idTeam"
                className="input input-bordered w-full"
                required
              >
                <option value="">Select team</option>
                {teams.map((team) => (
                  <option value={team.id} key={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-action">
              <button type="button" className="btn" onClick={handleModal}>
                Batal
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
