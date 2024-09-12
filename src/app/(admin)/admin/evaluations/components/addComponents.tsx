"use client";
import { useState, type SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import type { Team, EvaluationSheet } from "@prisma/client";

export default function AddComponents({
  teams,
  evaluationSheets,
}: {
  teams: Team[];
  evaluationSheets: EvaluationSheet[];
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [weight, setWeight] = useState("");
  const [componentNumber, setComponentNumber] = useState("");
  const [idTeam, setIdTeam] = useState("");
  const [idEvaluationSheet, setIdEvaluationSheet] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await axios.post("/api/components", {
      name: name,
      description: description,
      weight: weight,
      component_number: componentNumber,
      id_team: idTeam,
      id_LKE: idEvaluationSheet,
    });
    setIsLoading(false);
    setName("");
    setDescription("");
    setWeight("");
    setComponentNumber("");
    setIdTeam("");
    setIdEvaluationSheet("");
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
        className="flex flex-row items-center gap-1 text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6"
        >
          <title hidden>Tambah Komponen</title>
          <path
            fillRule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
            clipRule="evenodd"
          />
        </svg>{" "}
        <strong className="font-semibold">Tambah Komponen</strong>
      </button>

      <div className={isOpen ? "modal modal-open" : "modal"}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Tambah Komponen Baru</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-control w-full">
              <label className="label font-bold">Nama Komponen</label>
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
              <label className="label font-bold">Deskripsi</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="px-5 py-2 textarea textarea-bordered"
                placeholder="Deskripsi"
              />
            </div>
            <div className="form-control w-full">
              <label className="label font-bold">Bobot</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="input input-bordered"
                placeholder="0.00"
                required
              />
            </div>
            <div className="form-control w-full">
              <label className="label font-bold">Nomor Komponen</label>
              <input
                type="number"
                value={componentNumber}
                onChange={(e) => setComponentNumber(e.target.value)}
                className="input input-bordered"
                placeholder="0.00"
                required
              />
            </div>
            <div className="form-control w-full">
              <div className="grid grid-cols-2 gap-4">
                {" "}
                {/* Membagi menjadi dua kolom */}
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
                <div className="col-span-1">
                  <label
                    htmlFor="idEvaluationSheet"
                    className="label font-bold"
                  >
                    LKE
                  </label>
                  <select
                    value={idEvaluationSheet}
                    onChange={(e) => setIdEvaluationSheet(e.target.value)}
                    id="idEvaluationSheet"
                    className="input input-bordered w-full"
                    required
                  >
                    <option value="">Select LKE</option>
                    {evaluationSheets.map((evaluationSheet) => (
                      <option
                        value={evaluationSheet.id}
                        key={evaluationSheet.id}
                      >
                        {evaluationSheet.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
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
