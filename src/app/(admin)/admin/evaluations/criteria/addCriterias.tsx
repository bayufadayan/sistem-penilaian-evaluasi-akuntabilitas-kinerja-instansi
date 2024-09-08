"use client";
import { useState, type SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import type { SubComponent } from "@prisma/client";

export default function AddCriteria({ subComponents }: { subComponents : SubComponent[] }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [idSubComponents, setIdSubComponents] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await axios.post("/api/criterias", {
      name: name,
      description: description,
      id_subcomponents: Number(idSubComponents),
    });
    setIsLoading(false);
    setName("");
    setDescription("");
    setIdSubComponents("");
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
          <title hidden>Tambah Kriteria</title>
          <path
            fillRule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
            clipRule="evenodd"
          />
        </svg>{" "}
        <strong className="font-semibold">Tambah Kriteria</strong>
      </button>

      <div className={isOpen ? "modal modal-open" : "modal"}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Tambah Kriteria Baru</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-control w-full">
              <label className="label font-bold">Nama Kriteria</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered"
                placeholder="Nama Kriteria"
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
            <div className="col-span-1">
              <label
                htmlFor="idTeam"
                className="label font-bold"
              >
                Team
              </label>
              <select
                value={idSubComponents}
                onChange={(e) => setIdSubComponents(e.target.value)}
                id="idSubComponents"
                className="select select-bordered w-full"
                required
              >
                <option value="">Select Sub-Components</option>
                {subComponents.map((subComponent) => (
                  <option value={subComponent.id} key={subComponent.id}>
                    {subComponent.name}
                  </option>
                ))}
              </select>
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
